import pandas as pd

df = pd.read_csv('census.csv')
df = df[df.table==5]

import os
from os import path
for (gname, g) in df.groupby(['area', 'column']):
  print(gname)
  area = gname[0]
  gender = gname[1].split('_')[1]
  g = g[g.row != 'a102_unpaid']
  g['row_no'] = g.row.apply(lambda r: int(r.split('_')[0][1:]))
  relpath = 'areas/%s/%s/data.csv' % (area, gender)
  try:
    os.makedirs(path.dirname(relpath))
  except Exception as e:
    print(e)
  g.to_csv(relpath, index=False)
  #break
  #print(gname)
  #print(g.sort('row_no', ascending=True))
