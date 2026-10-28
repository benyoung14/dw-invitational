"""Build the DW Invitational 2026 backup scoring workbook.

Usage: python build_xlsx.py <backup.json> <out.xlsx> [--with-scores]
Players/teams/tee times come from the dashboard backup; scores only with --with-scores (test copy).
"""
import json, sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter as L
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule
from openpyxl.comments import Comment

src, out = sys.argv[1], sys.argv[2]
with_scores = '--with-scores' in sys.argv
B = json.load(open(src)); D = B.get('data', B)

# ---- course + round data (copied from the dashboard code) ----
COURSES = {
    'watson':   dict(name='Tom Watson', tees='Gold/Blue combo · 71.7/131',
                     par=[5,4,3,4,4,4,3,5,4,4,4,3,4,5,3,4,5,4],
                     hcp=[5,9,17,1,3,15,11,7,13,2,10,16,14,18,12,4,8,6]),
    'palmer':   dict(name='Arnold Palmer', tees='Gold · 70.9/133',
                     par=[4,3,5,4,3,4,4,4,5,5,4,4,4,3,5,3,4,4],
                     hcp=[5,11,9,15,13,7,17,1,3,6,14,8,2,18,12,16,10,4]),
    'nicklaus': dict(name='Jack Nicklaus', tees='Blue',
                     par=[4,4,5,4,3,5,4,3,4,4,3,4,4,4,5,3,4,5],
                     hcp=[17,1,5,3,7,13,9,15,11,4,18,6,10,2,12,8,14,16]),
}
ROUNDS = [
    dict(id='r1', sheet='R1 Watson',   title='Round I · Tom Watson',     day='Thursday, Nov 5', course='watson',   fmt='bestball'),
    dict(id='r2', sheet='R2 Palmer',   title='Round II · Arnold Palmer', day='Friday, Nov 6',   course='palmer',   fmt='bestball'),
    dict(id='r3', sheet='R3 Nicklaus', title='Round III · Jack Nicklaus', day='Saturday, Nov 7', course='nicklaus', fmt='singles'),
]

teams = D['teams']
team_name = {t['id']: t['name'] for t in teams}
# roster ordered by team so each team's 3 players sit together (best-ball formulas rely on it)
players = sorted(D['players'], key=lambda p: ([t['id'] for t in teams].index(p['team']), int(p['id'][1:])))
NP = len(players)
assert NP == 15 and all(sum(p['team'] == t['id'] for p in players) == 3 for t in teams)

def tee_time(rid, pid):
    for g in D['groups'].get(rid, []):
        if pid in (g.get('playerIds') or []):
            return f"{g['name'].replace('Group ', 'Grp ')} · {g['teeTime']}"
    return ''

# ---- styles ----
GREEN, GREEN_DK, CREAM, CREAM_LT, GOLD, GOLD_DK, INK, RULE = '0E5E3F', '063A26', 'F5EFE0', 'FAF6EC', 'C9A961', '8E7637', '1A1A14', 'D9CFB7'
F = lambda **k: Font(name='Arial', **{'size': 10, 'color': INK, **k})
fill = lambda c: PatternFill('solid', start_color=c, end_color=c)
thin = Side(style='thin', color=RULE)
box = Border(left=thin, right=thin, top=thin, bottom=thin)
center = Alignment(horizontal='center', vertical='center')
left = Alignment(horizontal='left', vertical='center')
INPUT_FILL = fill('FFF2CC')

wb = Workbook()

def title(ws, text, sub, width_to):
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=width_to)
    ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=width_to)
    ws['A1'] = text; ws['A2'] = sub
    for r, sz, col in ((1, 16, CREAM), (2, 10, GOLD)):
        c = ws.cell(r, 1); c.font = F(size=sz, bold=(r == 1), color=col); c.alignment = left
        for cc in range(1, width_to + 1):
            ws.cell(r, cc).fill = fill(GREEN_DK)
    ws.row_dimensions[1].height = 26

def header(ws, row, c1, c2, color=GREEN):
    for c in range(c1, c2 + 1):
        cell = ws.cell(row, c)
        cell.font = F(bold=True, color=CREAM); cell.fill = fill(color); cell.alignment = center; cell.border = box

def section(ws, row, text, width_to):
    ws.cell(row, 1, text).font = F(bold=True, size=11, color=GOLD_DK)

def style_range(ws, r1, r2, c1, c2, **kw):
    for r in range(r1, r2 + 1):
        for c in range(c1, c2 + 1):
            cell = ws.cell(r, c)
            cell.border = box
            cell.font = kw.get('font', F())
            cell.alignment = kw.get('align', center)
            if 'fill_' in kw: cell.fill = kw['fill_']
            if 'fmt' in kw: cell.number_format = kw['fmt']

# ================= Players sheet =================
wsP = wb.active; wsP.title = 'Players'
title(wsP, 'DW Invitational 2026 · Players & Teams', 'Reunion Resort · Nov 4-8, 2026 · handicaps and teams copied from the dashboard', 6)
wsP.append([])
wsP['A4'], wsP['B4'], wsP['C4'], wsP['D4'] = 'Player', 'Team', 'Handicap', 'Strokes (vs low man)'
header(wsP, 4, 1, 4)
P0 = 5  # first player row on Players sheet
for i, p in enumerate(players):
    r = P0 + i
    wsP.cell(r, 1, p['name']); wsP.cell(r, 2, team_name[p['team']]); wsP.cell(r, 3, round(p['handicap']))
    wsP.cell(r, 4, f'=MAX(0,C{r}-$C${P0 + NP + 1})')
PL = P0 + NP - 1
style_range(wsP, P0, PL, 1, 4)
for r in range(P0, PL + 1):
    wsP.cell(r, 1).alignment = left; wsP.cell(r, 2).alignment = left
    wsP.cell(r, 3).font = F(color='0000FF')
wsP.cell(P0 + NP + 1, 2, 'Field low handicap').font = F(bold=True)
wsP.cell(P0 + NP + 1, 3, f'=MIN(C{P0}:C{PL})').font = F(bold=True)
wsP.cell(P0 + NP + 3, 1, 'Handicaps (blue) can be edited here and every tab updates. Keep each team’s three players together in this list.').font = F(italic=True, color=GOLD_DK)
wsP.cell(P0 + NP + 4, 1, 'Strokes = your handicap minus the field low handicap, given on the hardest holes first (hole handicap 1, 2, 3…).').font = F(italic=True, color=GOLD_DK)
# teams list
wsP['F4'] = 'Teams'; header(wsP, 4, 6, 6)
for i, t in enumerate(teams):
    wsP.cell(P0 + i, 6, t['name'])
style_range(wsP, P0, P0 + len(teams) - 1, 6, 6, align=left)
wsP.column_dimensions['A'].width = 20; wsP.column_dimensions['B'].width = 26
wsP.column_dimensions['C'].width = 11; wsP.column_dimensions['D'].width = 20
wsP.column_dimensions['E'].width = 3; wsP.column_dimensions['F'].width = 26
wsP.freeze_panes = 'A5'

pname = lambda i: f"Players!$A${P0 + i}"
pteam = lambda i: f"Players!$B${P0 + i}"
phcp = lambda i: f"Players!$C${P0 + i}"
pstrokes = lambda i: f"Players!$D${P0 + i}"

# ================= Round sheets =================
H1 = 6                       # column F = hole 1
HC = [H1 + k for k in range(18)]
HL = lambda k: L(HC[k])      # letter for hole k (0-based)
COL_GROSS, COL_HOLES, COL_NET, COL_PTS, COL_MANK, COL_BIRD = 24, 25, 26, 27, 28, 29
R_HOLE, R_PAR, R_SI = 4, 5, 6
R_HEAD, R0 = 7, 8            # player rows 8..22
RL = R0 + NP - 1
round_refs = {}

for rd in ROUNDS:
    c = COURSES[rd['course']]
    ws = wb.create_sheet(rd['sheet'])
    title(ws, f"{rd['title']} — Scorecard", f"{rd['day']} · {c['name']} · {c['tees']} tees · par {sum(c['par'])}", COL_BIRD)

    # hole / par / stroke index rows
    ws.cell(R_HOLE, 5, 'Hole'); ws.cell(R_PAR, 5, 'Par'); ws.cell(R_SI, 5, 'Hole hcp')
    for k in range(18):
        ws.cell(R_HOLE, HC[k], k + 1); ws.cell(R_PAR, HC[k], c['par'][k]); ws.cell(R_SI, HC[k], c['hcp'][k])
    ws.cell(R_PAR, COL_GROSS, f'=SUM({HL(0)}{R_PAR}:{HL(17)}{R_PAR})')
    header(ws, R_HOLE, 5, COL_GROSS - 1)
    style_range(ws, R_PAR, R_SI, 5, COL_GROSS - 1, font=F(color=GREEN_DK), fill_=fill(CREAM))
    style_range(ws, R_PAR, R_PAR, COL_GROSS, COL_GROSS, font=F(bold=True), fill_=fill(CREAM))
    for r in (R_HOLE, R_PAR, R_SI):
        ws.cell(r, 5).alignment = Alignment(horizontal='right')

    heads = ['Player', 'Team', 'Hcp', 'Strokes', 'Group · Tee'] + [str(k + 1) for k in range(18)] + \
            ['Gross', 'Holes', 'Net', 'Mankles pts', 'Mankles round', 'Birdies+']
    for j, h in enumerate(heads):
        ws.cell(R_HEAD, 1 + j, h)
    header(ws, R_HEAD, 1, COL_BIRD)

    # calc blocks below the scorecard
    S0 = RL + 6               # skins winner row lives just under the card
    SK = RL + 2
    ST0 = RL + 6              # strokes grid
    NT0 = ST0 + NP + 3        # net grid
    PT0 = NT0 + NP + 3        # mankles points grid
    TB0 = PT0 + NP + 3        # team best ball block (bestball rounds)

    for i, p in enumerate(players):
        r = R0 + i
        ws.cell(r, 1, f'={pname(i)}'); ws.cell(r, 2, f'={pteam(i)}')
        ws.cell(r, 3, f'={phcp(i)}'); ws.cell(r, 4, f'={pstrokes(i)}')
        ws.cell(r, 5, tee_time(rd['id'], p['id']) if rd['id'] != 'r3' else '')
        if with_scores:
            sc = D['scores'].get(rd['id'], {}).get(p['id']) or []
            for k in range(18):
                if k < len(sc) and isinstance(sc[k], (int, float)):
                    ws.cell(r, HC[k], sc[k])
        g = f'{HL(0)}{r}:{HL(17)}{r}'
        ws.cell(r, COL_GROSS, f'=IF(COUNT({g})=0,"",SUM({g}))')
        ws.cell(r, COL_HOLES, f'=COUNT({g})')
        nr = NT0 + i
        ws.cell(r, COL_NET, f'=IF(COUNT({g})=0,"",SUM({HL(0)}{nr}:{HL(17)}{nr}))')
        pr = PT0 + i
        ws.cell(r, COL_PTS, f'=IF(COUNT({g})=0,"",SUM({HL(0)}{pr}:{HL(17)}{pr}))')
        ws.cell(r, COL_MANK, f'=IF(COUNT({g})=0,"",C{r}+AA{r})')
        ws.cell(r, COL_BIRD, f'=COUNTIF({HL(0)}{pr}:{HL(17)}{pr},">=4")')

    style_range(ws, R0, RL, 1, COL_BIRD)
    for r in range(R0, RL + 1):
        ws.cell(r, 1).alignment = left; ws.cell(r, 1).font = F(bold=True)
        ws.cell(r, 2).alignment = left; ws.cell(r, 2).font = F(size=9, color=GOLD_DK)
        ws.cell(r, 5).alignment = left; ws.cell(r, 5).font = F(size=9)
        for k in range(18):
            ws.cell(r, HC[k]).fill = INPUT_FILL; ws.cell(r, HC[k]).font = F(size=11, color='0000FF')
        ws.cell(r, COL_MANK).font = F(bold=True)
        # light band between teams
        if ((r - R0) // 3) % 2 == 1:
            for cc in list(range(1, 6)) + list(range(COL_GROSS, COL_BIRD + 1)):
                ws.cell(r, cc).fill = fill(CREAM_LT)
    if rd['id'] == 'r3':
        for r in range(R0, RL + 1):
            ws.cell(r, 5).fill = INPUT_FILL
        ws.cell(R_HEAD, 5).comment = Comment('Round 3 groups are set from the Mankles standings after Round 2. Type them here if you need them.', 'DW')

    # typo guard: whole number between 1 and 3x par (same rule as the dashboard)
    for k in range(18):
        dv = DataValidation(type='whole', operator='between', formula1='1', formula2=str(c['par'][k] * 3),
                            showErrorMessage=True, errorTitle='Check that score',
                            error=f'Hole {k + 1} is a par {c["par"][k]}. Enter a score from 1 to {c["par"][k] * 3}.')
        dv.add(f'{HL(k)}{R0}:{HL(k)}{RL}'); ws.add_data_validation(dv)
    # highlight birdie-or-better (gold) and double-bogey-or-worse (grey)
    rng = f'{HL(0)}{R0}:{HL(17)}{RL}'
    ws.conditional_formatting.add(rng, FormulaRule(formula=[f'AND(ISNUMBER({HL(0)}{R0}),{HL(0)}{R0}<={HL(0)}${R_PAR}-1)'],
                                                   fill=fill(GOLD), font=Font(name='Arial', bold=True, color=GREEN_DK)))
    ws.conditional_formatting.add(rng, FormulaRule(formula=[f'AND(ISNUMBER({HL(0)}{R0}),{HL(0)}{R0}>={HL(0)}${R_PAR}+2)'],
                                                   fill=fill('E6E1D3')))

    # skins row (net, full field, ties = no skin, no carryover)
    ws.cell(SK, 5, 'Skin winner'); ws.cell(SK, 5).font = F(bold=True); ws.cell(SK, 5).alignment = Alignment(horizontal='right')
    for k in range(18):
        col = f'{HL(k)}{NT0}:{HL(k)}{NT0 + NP - 1}'
        names = f'$A${R0}:$A${RL}'
        ws.cell(SK, HC[k], f'=IF(COUNT({col})<{NP},"",IF(COUNTIF({col},MIN({col}))>1,"tie",INDEX({names},MATCH(MIN({col}),{col},0))))')
    style_range(ws, SK, SK, HC[0], HC[17], font=F(size=8, bold=True, color=GREEN_DK), fill_=fill(CREAM))
    ws.row_dimensions[SK].height = 30
    for k in range(18):
        ws.cell(SK, HC[k]).alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    ws.cell(SK + 1, 5, 'Skins won'); ws.cell(SK + 1, 5).alignment = Alignment(horizontal='right')
    ws.cell(SK + 1, 6, f'=COUNTIF({HL(0)}{SK}:{HL(17)}{SK},"?*")-COUNTIF({HL(0)}{SK}:{HL(17)}{SK},"tie")')
    ws.cell(SK + 1, 8, '$ per skin'); ws.cell(SK + 1, 8).alignment = Alignment(horizontal='right')
    ws.cell(SK + 1, 9, f'=IF(F{SK + 1}=0,0,Leaderboard!$B$3/F{SK + 1})'); ws.cell(SK + 1, 9).number_format = '$#,##0.00'
    for cc in (6, 9): ws.cell(SK + 1, cc).font = F(bold=True)

    # strokes grid
    section(ws, ST0 - 1, 'Handicap strokes on each hole (automatic)', COL_BIRD)
    for i in range(NP):
        r = ST0 + i
        ws.cell(r, 1, f'=A{R0 + i}')
        for k in range(18):
            ws.cell(r, HC[k], f'=INT($D{R0 + i}/18)+IF({HL(k)}${R_SI}<=MOD($D{R0 + i},18),1,0)')
    style_range(ws, ST0, ST0 + NP - 1, 1, 1, align=left, font=F(color='808080'))
    style_range(ws, ST0, ST0 + NP - 1, HC[0], HC[17], font=F(color='808080'))
    # net grid
    section(ws, NT0 - 1, 'Net score on each hole (gross minus strokes)', COL_BIRD)
    for i in range(NP):
        r = NT0 + i
        ws.cell(r, 1, f'=A{R0 + i}')
        for k in range(18):
            gcell = f'{HL(k)}{R0 + i}'
            ws.cell(r, HC[k], f'=IF(ISNUMBER({gcell}),{gcell}-{HL(k)}{ST0 + i},"")')
    style_range(ws, NT0, NT0 + NP - 1, 1, 1, align=left, font=F(color='808080'))
    style_range(ws, NT0, NT0 + NP - 1, HC[0], HC[17], font=F(color='808080'))
    # mankles points grid
    section(ws, PT0 - 1, 'Mankles points on each hole (gross vs par: eagle+ 8, birdie 4, par 2, bogey 1, double 0, triple+ −1)', COL_BIRD)
    for i in range(NP):
        r = PT0 + i
        ws.cell(r, 1, f'=A{R0 + i}')
        for k in range(18):
            gcell, par = f'{HL(k)}{R0 + i}', f'{HL(k)}${R_PAR}'
            d = f'({gcell}-{par})'
            ws.cell(r, HC[k], f'=IF(ISNUMBER({gcell}),IF({d}<=-2,8,IF({d}=-1,4,IF({d}=0,2,IF({d}=1,1,IF({d}=2,0,-1))))),"")')
    style_range(ws, PT0, PT0 + NP - 1, 1, 1, align=left, font=F(color='808080'))
    style_range(ws, PT0, PT0 + NP - 1, HC[0], HC[17], font=F(color='808080'))

    ref = dict(sheet=rd['sheet'], fmt=rd['fmt'], SK=SK)
    if rd['fmt'] == 'bestball':
        section(ws, TB0 - 1, 'Team best ball — two lowest net scores per hole', COL_BIRD)
        ws.cell(TB0, 1, 'Team'); ws.cell(TB0, COL_GROSS, 'Best ball'); ws.cell(TB0, COL_HOLES, 'Place')
        ws.cell(TB0, COL_NET, 'Team pts')
        for k in range(18): ws.cell(TB0, HC[k], k + 1)
        header(ws, TB0, 1, COL_NET)
        tr0 = TB0 + 1
        for t in range(5):
            r = tr0 + t
            m0, m1 = NT0 + 3 * t, NT0 + 3 * t + 2
            ws.cell(r, 1, f'=B{R0 + 3 * t}')
            for k in range(18):
                rg = f'{HL(k)}{m0}:{HL(k)}{m1}'
                ws.cell(r, HC[k], f'=IF(COUNT({rg})<2,"",SMALL({rg},1)+SMALL({rg},2))')
            ws.cell(r, COL_GROSS, f'=IF(COUNT({HL(0)}{r}:{HL(17)}{r})<18,"",SUM({HL(0)}{r}:{HL(17)}{r}))')
            tot = f'$X${tr0}:$X${tr0 + 4}'
            ws.cell(r, COL_HOLES, f'=IF(X{r}="","",COUNTIF({tot},"<"&X{r})+1)')
            ws.cell(r, COL_NET, f'=IF(X{r}="","",AVERAGE(OFFSET(Leaderboard!$B$5,Y{r}-1,0,COUNTIF({tot},X{r}),1)))')
        style_range(ws, tr0, tr0 + 4, 1, COL_NET)
        for r in range(tr0, tr0 + 5):
            ws.cell(r, 1).alignment = left; ws.cell(r, 1).font = F(bold=True)
            ws.cell(r, COL_NET).font = F(bold=True)
        ws.merge_cells(start_row=TB0, start_column=1, end_row=TB0, end_column=5)
        for t in range(5):
            ws.merge_cells(start_row=tr0 + t, start_column=1, end_row=tr0 + t, end_column=5)
        ws.cell(tr0 + 6, 1, 'A team scores once all 18 holes have at least two net scores. Ties split the points for the places they share.').font = F(italic=True, color=GOLD_DK)
        ref['team_rows'] = (tr0, tr0 + 4)
    else:
        # singles net: every player's net rank -> 15, 14 … 1 (ties split)
        ws.cell(R_HEAD, COL_BIRD + 1, 'Net place'); ws.cell(R_HEAD, COL_BIRD + 2, 'Team pts')
        header(ws, R_HEAD, COL_BIRD + 1, COL_BIRD + 2)
        full = f'$AF${R0}:$AF${RL}'
        for i in range(NP):
            r = R0 + i
            # helper: net only when all 18 holes are in
            ws.cell(r, 32, f'=IF(Y{r}=18,Z{r},"")')
            ws.cell(r, COL_BIRD + 1, f'=IF(AF{r}="","",COUNTIF({full},"<"&AF{r})+1)')
            ws.cell(r, COL_BIRD + 2, f'=IF(AF{r}="","",COUNTA($A${R0}:$A${RL})+1-AD{r}-(COUNTIF({full},AF{r})-1)/2)')
        style_range(ws, R0, RL, COL_BIRD + 1, COL_BIRD + 2)
        for r in range(R0, RL + 1): ws.cell(r, COL_BIRD + 2).font = F(bold=True)
        ws.column_dimensions['AF'].hidden = True
        ws.cell(RL + 4, 1, 'Round 3 team points: each player’s full-round net is ranked across the field — 1st = 15 pts down to 15th = 1 pt, ties split. Points go to the player’s team.').font = F(italic=True, color=GOLD_DK)
    round_refs[rd['id']] = ref

    # layout
    ws.column_dimensions['A'].width = 17; ws.column_dimensions['B'].width = 17
    ws.column_dimensions['C'].width = 5; ws.column_dimensions['D'].width = 7; ws.column_dimensions['E'].width = 15
    for k in range(18): ws.column_dimensions[HL(k)].width = 5.2
    for cc, w in ((COL_GROSS, 7), (COL_HOLES, 7), (COL_NET, 7), (COL_PTS, 9), (COL_MANK, 10), (COL_BIRD, 8), (30, 8), (31, 8)):
        ws.column_dimensions[L(cc)].width = w
    ws.freeze_panes = ws.cell(R0, H1)
    ws.sheet_view.zoomScale = 110

# ================= Leaderboard =================
wl = wb.create_sheet('Leaderboard', 0)
title(wl, 'DW Invitational 2026 · Live Standings', 'Backup scoring sheet · type scores on the R1 / R2 / R3 tabs and this page updates itself', 9)
wl['A3'] = 'Skins pot per round'; wl['B3'] = 180; wl['B3'].number_format = '$#,##0'; wl['B3'].font = F(color='0000FF', bold=True)
wl['A4'] = 'Team place points'; wl['A4'].font = F(bold=True)
for i, v in enumerate([20, 15, 10, 5, 0]):
    wl.cell(5 + i, 1, f'{["1st","2nd","3rd","4th","5th"][i]} place'); wl.cell(5 + i, 2, v).font = F(color='0000FF')
style_range(wl, 5, 9, 1, 2)
wl['B3'].font = F(color='0000FF', bold=True)
for r in range(5, 10): wl.cell(r, 2).font = F(color='0000FF')

# --- team standings: calc rows (unsorted, one per team) then a sorted display
T_CALC = 42
wl.cell(T_CALC - 1, 1, 'Team totals (working rows — the sorted table is above)').font = F(italic=True, color='808080')
for j, h in enumerate(['Team', 'R1', 'R2', 'R3', 'Total', 'Sort key', 'Any round done']):
    wl.cell(T_CALC, 1 + j, h)
header(wl, T_CALC, 1, 7, color='808080')
r1rows, r2rows = round_refs['r1']['team_rows'], round_refs['r2']['team_rows']
r3 = round_refs['r3']
for t in range(5):
    r = T_CALC + 1 + t
    wl.cell(r, 1, f'=Players!$F${P0 + t}')
    wl.cell(r, 2, f"='R1 Watson'!Z{r1rows[0] + t}")
    wl.cell(r, 3, f"='R2 Palmer'!Z{r2rows[0] + t}")
    # R3: sum of this team's players' singles points (only once someone has finished)
    rng_t, rng_p = f"'R3 Nicklaus'!$B${R0}:$B${RL}", f"'R3 Nicklaus'!$AE${R0}:$AE${RL}"
    wl.cell(r, 4, f'=IF(COUNTIFS({rng_t},A{r},{rng_p},">=0")=0,"",SUMIF({rng_t},A{r},{rng_p}))')
    wl.cell(r, 5, f'=SUM(B{r}:D{r})')
    wl.cell(r, 6, f'=E{r}+(10-{t})/1000')
    wl.cell(r, 7, f'=COUNT(B{r}:D{r})>0')
style_range(wl, T_CALC + 1, T_CALC + 5, 1, 7, font=F(color='808080'))

# sorted team display
TD = 12
wl.cell(TD - 1, 1, 'Team Standings').font = F(bold=True, size=12, color=GREEN_DK)
for j, h in enumerate(['Pos', 'Team', 'R1', 'R2', 'R3', 'Total']):
    wl.cell(TD, 1 + j, h)
header(wl, TD, 1, 6)
keys = f'$F${T_CALC + 1}:$F${T_CALC + 5}'
for n in range(5):
    r = TD + 1 + n
    m = f'MATCH(LARGE({keys},{n + 1}),{keys},0)'
    wl.cell(r, 1, f'=IF(G{T_CALC + 1}+G{T_CALC + 2}+G{T_CALC + 3}+G{T_CALC + 4}+G{T_CALC + 5}=0,"—",{n + 1})')
    wl.cell(r, 2, f'=INDEX($A${T_CALC + 1}:$A${T_CALC + 5},{m})')
    for j, col in enumerate('BCD'):
        wl.cell(r, 3 + j, f'=IF(INDEX(${col}${T_CALC + 1}:${col}${T_CALC + 5},{m})="","—",INDEX(${col}${T_CALC + 1}:${col}${T_CALC + 5},{m}))')
    wl.cell(r, 6, f'=IF(INDEX($G${T_CALC + 1}:$G${T_CALC + 5},{m}),INDEX($E${T_CALC + 1}:$E${T_CALC + 5},{m}),"—")')
style_range(wl, TD + 1, TD + 5, 1, 6, fmt='0.#;-0.#;0')
for r in range(TD + 1, TD + 6):
    wl.cell(r, 2).alignment = left; wl.cell(r, 2).font = F(bold=True); wl.cell(r, 6).font = F(bold=True, color=GREEN_DK)
wl.cell(TD + 6, 1, 'R1 & R2: team best ball (2 lowest nets per hole) → 20/15/10/5/0. R3: singles net → 15…1 per player, to their team.').font = F(italic=True, color=GOLD_DK, size=9)

# --- Mankles: calc rows then sorted display
M_CALC = T_CALC + 9
wl.cell(M_CALC - 1, 1, 'Mankles totals (working rows)').font = F(italic=True, color='808080')
for j, h in enumerate(['Player', 'Team', 'Hcp', 'R1', 'R2', 'R3', 'Total', 'Birdies+', 'Sort key', 'Rounds played']):
    wl.cell(M_CALC, 1 + j, h)
header(wl, M_CALC, 1, 10, color='808080')
for i in range(NP):
    r = M_CALC + 1 + i
    wl.cell(r, 1, f'={pname(i)}'); wl.cell(r, 2, f'={pteam(i)}'); wl.cell(r, 3, f'={phcp(i)}')
    for j, rd in enumerate(ROUNDS):
        wl.cell(r, 4 + j, f"='{rd['sheet']}'!AB{R0 + i}")
    wl.cell(r, 7, f'=SUM(D{r}:F{r})')
    wl.cell(r, 8, '=' + '+'.join(f"'{rd['sheet']}'!AC{R0 + i}" for rd in ROUNDS))
    wl.cell(r, 9, f'=G{r}*100+H{r}+({NP + 5}-{i})/1000')
    wl.cell(r, 10, f'=COUNT(D{r}:F{r})')
style_range(wl, M_CALC + 1, M_CALC + NP, 1, 10, font=F(color='808080'))

MD = TD + 9
wl.cell(MD - 1, 1, 'Individual Mankles · handicap + points per round').font = F(bold=True, size=12, color=GREEN_DK)
for j, h in enumerate(['Pos', 'Player', 'Team', 'Hcp', 'R1', 'R2', 'R3', 'Total', 'Birdies+']):
    wl.cell(MD, 1 + j, h)
header(wl, MD, 1, 9)
mk = f'$I${M_CALC + 1}:$I${M_CALC + NP}'
anyplayed = f'SUM($J${M_CALC + 1}:$J${M_CALC + NP})=0'
for n in range(NP):
    r = MD + 1 + n
    m = f'MATCH(LARGE({mk},{n + 1}),{mk},0)'
    wl.cell(r, 1, f'=IF({anyplayed},"—",{n + 1})')
    for j, col in enumerate('ABC'):
        wl.cell(r, 2 + j, f'=INDEX(${col}${M_CALC + 1}:${col}${M_CALC + NP},{m})')
    for j, col in enumerate('DEF'):
        wl.cell(r, 5 + j, f'=IF(INDEX(${col}${M_CALC + 1}:${col}${M_CALC + NP},{m})="","—",INDEX(${col}${M_CALC + 1}:${col}${M_CALC + NP},{m}))')
    wl.cell(r, 8, f'=IF(INDEX($J${M_CALC + 1}:$J${M_CALC + NP},{m})=0,"—",INDEX($G${M_CALC + 1}:$G${M_CALC + NP},{m}))')
    wl.cell(r, 9, f'=INDEX($H${M_CALC + 1}:$H${M_CALC + NP},{m})')
style_range(wl, MD + 1, MD + NP, 1, 9)
for r in range(MD + 1, MD + NP + 1):
    wl.cell(r, 2).alignment = left; wl.cell(r, 2).font = F(bold=True)
    wl.cell(r, 3).alignment = left; wl.cell(r, 3).font = F(size=9, color=GOLD_DK)
    wl.cell(r, 8).font = F(bold=True, color=GREEN_DK)
wl.conditional_formatting.add(f'A{MD + 1}:I{MD + 1}', FormulaRule(formula=[f'ISNUMBER($H${MD + 1})'], fill=fill('F3E7C4')))
wl.cell(MD + NP + 1, 1, 'Each round = handicap + Mankles points. Ties on total go to the most birdies (or better) across all rounds.').font = F(italic=True, color=GOLD_DK, size=9)

wl.column_dimensions['A'].width = 18
for col, w in zip('BCDEFGHIJ', (24, 22, 7, 7, 7, 7, 9, 9, 12)):
    wl.column_dimensions[col].width = w
wl.sheet_view.zoomScale = 110
# working rows stay visible but out of the way
wl.cell(T_CALC - 3, 1, '— Working rows below feed the tables above. Don’t type here. —').font = F(italic=True, color='808080')

# ================= Skins =================
wsk = wb.create_sheet('Skins', 1)
title(wsk, 'Skins · $180 per round', 'Lowest net score on a hole wins it outright · ties = no skin · no carry-overs · pot split across skins won', 9)
for j, h in enumerate(['Player', 'R1 skins', 'R1 $', 'R2 skins', 'R2 $', 'R3 skins', 'R3 $', 'Total skins', 'Total $']):
    wsk.cell(4, 1 + j, h)
header(wsk, 4, 1, 9)
for i in range(NP):
    r = 5 + i
    wsk.cell(r, 1, f'={pname(i)}')
    for j, rd in enumerate(ROUNDS):
        SKr = round_refs[rd['id']]['SK']
        sh = f"'{rd['sheet']}'"
        wsk.cell(r, 2 + 2 * j, f'=COUNTIF({sh}!${HL(0)}${SKr}:${HL(17)}${SKr},A{r})')
        wsk.cell(r, 3 + 2 * j, f'={L(2 + 2 * j)}{r}*{sh}!$I${SKr + 1}')
    wsk.cell(r, 8, f'=B{r}+D{r}+F{r}'); wsk.cell(r, 9, f'=C{r}+E{r}+G{r}')
style_range(wsk, 5, 4 + NP, 1, 9)
tr = 5 + NP
wsk.cell(tr, 1, 'Total')
for cc in range(2, 10):
    wsk.cell(tr, cc, f'=SUM({L(cc)}5:{L(cc)}{tr - 1})')
style_range(wsk, tr, tr, 1, 9, font=F(bold=True), fill_=fill(CREAM))
for r in range(5, tr + 1):
    wsk.cell(r, 1).alignment = left
    for cc in (3, 5, 7, 9): wsk.cell(r, cc).number_format = '$#,##0.00;-$#,##0.00;-'
    for cc in (2, 4, 6, 8): wsk.cell(r, cc).number_format = '0;-0;-'
wsk.cell(tr + 2, 1, 'A hole only counts once all 15 players have a score on it. Hole-by-hole winners are under each scorecard on the R1 / R2 / R3 tabs.').font = F(italic=True, color=GOLD_DK, size=9)
wsk.column_dimensions['A'].width = 18
for col in 'BCDEFGHI': wsk.column_dimensions[col].width = 11

# ================= How To Use =================
wh = wb.create_sheet('How To Use', 0)
title(wh, 'DW Invitational 2026 · Backup Scoring Sheet', 'Use this only if the website is down. It follows the same rules as the dashboard.', 2)
lines = [
    ('ENTERING SCORES', None),
    ('1.', 'Open the tab for the round: R1 Watson (Thu), R2 Palmer (Fri), or R3 Nicklaus (Sat).'),
    ('2.', 'Type each player’s GROSS score in the yellow boxes, one box per hole. Leave unplayed holes blank.'),
    ('3.', 'Everything else is automatic: strokes, net scores, Mankles points, team best ball, skins and the Leaderboard.'),
    ('4.', 'A score that looks like a typo (0, or more than 3× par) is blocked, same as the website.'),
    ('', ''),
    ('WHAT THE COLORS MEAN', None),
    ('Yellow', 'Type here (scores). Round 3 also has a yellow “Group · Tee” column for the Saturday pairings.'),
    ('Blue text', 'Settings you can change: handicaps on the Players tab, skins pot and team place points on the Leaderboard.'),
    ('Gold square', 'Birdie or better. Grey square = double bogey or worse.'),
    ('Grey text', 'Working math. Don’t type over it.'),
    ('', ''),
    ('THE RULES', None),
    ('Strokes', 'Everyone strokes off the field low handicap (Frank Barta, 8): your handicap − 8, on the hardest holes first.'),
    ('R1 & R2', 'Team best ball: on each hole, add the two lowest net scores of the three teammates. Teams rank 1–5 → 20 / 15 / 10 / 5 / 0 points.'),
    ('R3', 'Singles net: every player’s net total is ranked across the field. 1st = 15 points, down to 15th = 1 point. Points go to the player’s team.'),
    ('Ties', 'Teams or players who tie split the points for the places they share.'),
    ('Mankles', 'Each round = handicap + points on gross vs par: eagle or better 8, birdie 4, par 2, bogey 1, double 0, triple or worse −1. Ties on the 3-round total go to the most birdies.'),
    ('Skins', '$180 per round. Lowest net on a hole wins the skin outright; ties = no skin, no carry-overs. The pot is split evenly across the skins won.'),
    ('R3 groups', 'After Round 2, the lowest Mankles totals tee off first (10:50 group of 3) and the leaders go last (11:20). Check the Leaderboard and type the groups on the R3 tab.'),
    ('', ''),
    ('PHONE TIP', None),
    ('Excel app', 'Works in the free Excel app on iPhone. Save a copy to OneDrive or iCloud before the trip so it opens without the internet.'),
]
r = 4
for a, b in lines:
    if b is None:
        wh.cell(r, 1, a).font = F(bold=True, size=11, color=GOLD_DK)
    else:
        wh.cell(r, 1, a).font = F(bold=True)
        wh.cell(r, 2, b).font = F()
        wh.cell(r, 2).alignment = Alignment(wrap_text=True, vertical='top')
        wh.cell(r, 1).alignment = Alignment(vertical='top')
    if a == 'Yellow': wh.cell(r, 1).fill = INPUT_FILL
    if a == 'Blue text': wh.cell(r, 1).font = F(bold=True, color='0000FF')
    if a == 'Gold square': wh.cell(r, 1).fill = fill(GOLD)
    if a == 'Grey text': wh.cell(r, 1).font = F(bold=True, color='808080')
    r += 1
wh.column_dimensions['A'].width = 14; wh.column_dimensions['B'].width = 110

# tab colors + order: How To Use, Leaderboard, Skins, R1, R2, R3, Players
wb._sheets = [wb[n] for n in ['How To Use', 'Leaderboard', 'Skins', 'R1 Watson', 'R2 Palmer', 'R3 Nicklaus', 'Players']]
for n, col in (('How To Use', GOLD), ('Leaderboard', GREEN_DK), ('Skins', GOLD_DK), ('R1 Watson', GREEN), ('R2 Palmer', GREEN), ('R3 Nicklaus', GREEN), ('Players', '808080')):
    wb[n].sheet_properties.tabColor = col
for ws in wb.worksheets:
    ws.sheet_view.showGridLines = False
    # explicit background everywhere in use, so dark-mode viewers still show dark text
    for row in ws.iter_rows(min_row=1, max_row=ws.max_row + 5, min_col=1, max_col=ws.max_column + 2):
        for cell in row:
            if cell.fill is None or cell.fill.fill_type is None:
                cell.fill = fill(CREAM_LT if ws.title == 'How To Use' else 'FFFFFF')
wb.active = 1
wb.save(out)
print('saved', out)
