
print ("IMPORTING LIBRARIES...")
import pandas as pd

    
print ("LOADING DATASETS...")
df = pd.read_csv("dev.csv") #DEV-SAMPLE
df.head()
"""
    id  ib_var_1  ib_var_2  ib_var_3  ...  if_var_79  if_var_80  if_var_81  ob_target
0   1         0         1         0  ...     5140.0   0.766667          1          0
1   2         0         1         0  ...     2570.0   0.700000          4          0
2   3         0         0         0  ...     5140.0   0.666667          2          0
3   4         0         1         0  ...     1028.0   0.766667          3          0
4   5         0         0         0  ...     5140.0   0.733333          3          0
"""

dfo = pd.read_csv("oot0.csv")#OUT-OF-TIME SAMPLE
dfo.head()
"""
NOTE THAT dfo DOES NOT INCLUDE THE TARGET VARIABLE NAMED ob_target
    id  ib_var_1  ib_var_2  ...    if_var_79  if_var_80  if_var_81
0   1         0         1  ...  5140.000000   0.666667          3
1   2         1         0  ...  5140.000000   0.733333          0
2   3         0         0  ...  2570.000000   0.766667          1
3   4         0         1  ...  2056.000000   0.833333          0
4   5         1         0  ...  4728.799805   0.633333          2
"""


"""
Identifying the types of the variables:
*  id is a primary key auto incremental
*  ib_var_1 is input binary - flag 0/1 variable
*  ib_var_2 is input binary - flag 0/1 variable
*  ib_var_3 is input binary - flag 0/1 variable
*  ib_var_4 is input binary - flag 0/1 variable
*  ib_var_5 is input binary - flag 0/1 variable
*  ib_var_6 is input binary - flag 0/1 variable
*  ib_var_7 is input binary - flag 0/1 variable
*  ib_var_8 is input binary - flag 0/1 variable
*  ib_var_9 is input binary - flag 0/1 variable
*  ib_var_10 is input binary - flag 0/1 variable
*  ib_var_11 is input binary - flag 0/1 variable
*  ib_var_12 is input binary - flag 0/1 variable
*  ib_var_13 is input binary - flag 0/1 variable
*  ib_var_14 is input binary - flag 0/1 variable
*  ib_var_15 is input binary - flag 0/1 variable
*  ib_var_16 is input binary - flag 0/1 variable
*  ib_var_17 is input binary - flag 0/1 variable
*  ib_var_18 is input binary - flag 0/1 variable
*  ib_var_19 is input binary - flag 0/1 variable
*  ib_var_20 is input binary - flag 0/1 variable
*  ib_var_21 is input binary - flag 0/1 variable
*  icn_var_22 is input categorical nominal
*  icn_var_23 is input categorical nominal
*  icn_var_24 is input categorical nominal
*  ico_var_25 is input categorical ordinal
*  ico_var_26 is input categorical ordinal
*  ico_var_27 is input categorical ordinal
*  ico_var_28 is input categorical ordinal
*  ico_var_29 is input categorical ordinal
*  ico_var_30 is input categorical ordinal
*  ico_var_31 is input categorical ordinal
*  ico_var_32 is input categorical ordinal
*  ico_var_33 is input categorical ordinal
*  ico_var_34 is input categorical ordinal
*  ico_var_35 is input categorical ordinal
*  ico_var_36 is input categorical ordinal
*  ico_var_37 is input categorical ordinal
*  ico_var_38 is input categorical ordinal
*  ico_var_39 is input categorical ordinal
*  ico_var_40 is input categorical ordinal
*  ico_var_41 is input categorical ordinal
*  ico_var_42 is input categorical ordinal
*  ico_var_43 is input categorical ordinal
*  ico_var_44 is input categorical ordinal
*  ico_var_45 is input categorical ordinal
*  ico_var_46 is input categorical ordinal
*  ico_var_47 is input categorical ordinal
*  ico_var_48 is input categorical ordinal
*  ico_var_49 is input categorical ordinal
*  ico_var_50 is input categorical ordinal
*  ico_var_51 is input categorical ordinal
*  ico_var_52 is input categorical ordinal
*  ico_var_53 is input categorical ordinal
*  ico_var_54 is input categorical ordinal
*  ico_var_55 is input categorical ordinal
*  ico_var_56 is input categorical ordinal
*  ico_var_57 is input categorical ordinal
*  ico_var_58 is input categorical ordinal
*  ico_var_59 is input categorical ordinal
*  ico_var_60 is input categorical ordinal
*  ico_var_61 is input categorical ordinal
*  ico_var_62 is input categorical ordinal
*  ico_var_63 is input categorical ordinal
*  ico_var_64 is input categorical ordinal
*  if_var_65 is input numerical continuos (input float)
*  if_var_66 is input numerical continuos (input float)
*  if_var_67 is input numerical continuos (input float)
*  if_var_68 is input numerical continuos (input float)
*  if_var_69 is input numerical continuos (input float)
*  if_var_70 is input numerical continuos (input float)
*  if_var_71 is input numerical continuos (input float)
*  if_var_72 is input numerical continuos (input float)
*  if_var_73 is input numerical continuos (input float)
*  if_var_74 is input numerical continuos (input float)
*  if_var_75 is input numerical continuos (input float)
*  if_var_76 is input numerical continuos (input float)
*  if_var_77 is input numerical continuos (input float)
*  if_var_78 is input numerical continuos (input float)
*  if_var_79 is input numerical continuos (input float)
*  if_var_80 is input numerical continuos (input float)
*  if_var_81 is input numerical continuos (input float)
*  ob_target is output binary (target variable: 1 meaning fraud case and 0 non-fraud case)
"""


print ("STEP 1: DOING MY TRANSFORMATIONS...")
df = df.fillna(0)
dfo = dfo.fillna(0)


print ("STEP 2: SELECTING CHARACTERISTICS TO ENTER INTO THE MODEL...")
#in_model = list_inputs #['ib_var_1','icn_var_22','ico_var_25','if_var_65']
in_model = ['age','workclass','education','education_num','marital_status','occupation','relationship','race','gender','hours_per_week','native_country']
output_var = 'greater_than_50k'

print ("STEP 3: DEVELOPING THE MODEL...")
X = df[in_model]
y = df[output_var]
Xo = dfo[in_model]

from sklearn.linear_model import LogisticRegression
clf = LogisticRegression(random_state=0, solver='lbfgs')
fitted_model = clf.fit(X, y)
pred_dev = fitted_model.predict_proba(X)[:,1]
pred_oot  = fitted_model.predict_proba(Xo)[:,1]



print ("STEP 4: ASSESSING THE MODEL...")
# CALCULATING GINI PERFORMANCE ON DEVELOPMENT SAMPLE
from sklearn.metrics import roc_auc_score
gini_score = 2*roc_auc_score(y, pred_dev)-1
print ("GINI DEVELOPMENT=", gini_score)

def KS(b,a):  
    """Function that received two parameters; first: a binary variable representing 0=good and 1=bad, 
    and then a second variable with the prediction of the first variable, the second variable can be continuous, 
    integer or binary - continuous is better. Finally, the function returns the KS Statistics of the two lists."""
    try:
        tot_bads=1.0*sum(b)
        tot_goods=1.0*(len(b)-tot_bads)
        elements = zip(*[a,b])
        elements = sorted(elements,key= lambda x: x[0])
        elements_df = pd.DataFrame({'probability': b,'gbi': a})
        pivot_elements_df = pd.pivot_table(elements_df, values='probability', index=['gbi'], aggfunc=[sum,len]).fillna(0)
        max_ks = perc_goods = perc_bads = cum_perc_bads = cum_perc_goods = 0
        for i in range(len(pivot_elements_df)):
            perc_goods =  (pivot_elements_df.iloc[i]['len'] - pivot_elements_df.iloc[i]['sum']) / tot_goods
            perc_bads = pivot_elements_df.iloc[i]['sum']/ tot_bads
            cum_perc_goods += perc_goods
            cum_perc_bads += perc_bads
            A = cum_perc_bads-cum_perc_goods
            if abs(A['probability']) > max_ks:
                max_ks = abs(A['probability'])
    except:
        max_ks = 0
    return max_ks

KS_score = KS(y,pred_dev)
print ("KS DEVELOPMENT=", KS_score) 

"""
WHAT IS GINI AND KS?
* watch this video for reference: https://youtu.be/MiBUBVUC8kE
"""

print ("STEP 5: SUBMITTING THE RESULTS...")
import requests
from requests.auth import HTTPBasicAuth
dfo['pred'] = pred_oot
dfo_tosend = dfo[list(['id','pred'])]
i=1
filename = "student_sub"+str(i)+".csv"
dfo_tosend.to_csv(filename, sep=',')
url = 'http://localhost:3000/challenges/5ec6570b77c199312ae5a30e/uploadPredictions'
files = {'competition': (filename, open(filename, 'rb')),'email':'CHANGE WITH YOUR USER MAIL', 'password':'CHANGE WITH YOUR USER PASSWORD'}

"""
To compete in this challenge, please create an user at my teaching website: http://mfalonso.pythonanywhere.com
and replace below where it says:
* my_user_name_goes_here
* my_password_goes_here
"""
rsub = requests.post(url, files=files)
resp_str = str(rsub.text)
print ("RESULT SUBMISSION: ", resp_str)