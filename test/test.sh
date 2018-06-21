ROOT_URL="http://:3000"
COOKIE_FILE="cookie.txt"

echo "Test API on $ROOT_URL"

# curl -X POST --header 'Content-Type: application/x-www-form-urlencoded' --header 'Accept: application/json' -d 'number=111&password=1111' 'http://127.0.0.1:3000/session'
# curl -X POST  -d 'number=13128809301&password=123456' 'http://127.0.0.1:3000/session' -D cookie.txt
# curl -b cookie.txt http://:3000/restaurant/desk -d desk_number=10 -X PUT

echo "----- Session API -----"
SES="$ROOT_URL/session"

# GET /session
echo "GET $SES"
curl "$SES?code=TEST_CODE&nickname=wakeup" -X GET -D $COOKIE_FILE
echo $'\n\n'


echo "----- Team API -----"
TEA="$ROOT_URL/team"
INV="$ROOT_URL/team/invitation"
JOI="$ROOT_URL/team/join"
MEM="$ROOT_URL/team/member"
# POST /team
echo "POST $TEA"
curl $TEA -X POST -b $COOKIE_FILE -d "name=中山大学&bio=爸爸去哪"
echo $'\n'

# GET /team
echo "GET $TEA"
curl "$TEA?option=joined" -X GET -b $COOKIE_FILE
echo $'\n'

# GET /team/invitation
echo "GET $INV"
curl "$INV?team_id=1" -X GET -b $COOKIE_FILE
echo $'\n'

# GET /team/join
echo "GET $JOI"
echo "curl -X GET -b $COOKIE_FILE"
echo $'\n'

# GET /team/member
echo "GET $MEM"
curl "$MEM?team_id=1" -X GET -b $COOKIE_FILE
echo $'\n\n'

echo "----- Schedule API -----"
MET="$ROOT_URL/schedule/meta"
SCH="$ROOT_URL/schedule"
# POST /schedule/meta
echo "POST $MET"
curl $MET -X POST -d "training_name=1000米&index1=分钟&index2=第一圈用时&index3=第二圈用时&index4=无&team_id=1" -b $COOKIE_FILE
echo $'\n'

# GET /schedule/meat
echo "GET $MET"
curl "$MET?team_id=1" -X GET -b $COOKIE_FILE
echo $'\n'

# POST /schedule
echo "POST $SCH"
curl $SCH -X POST -b $COOKIE_FILE -H "Content-Type: application/json"  -d '{"title": "title", "description" : "doit", "training_class":"测试", "team_id":1, "training_date": "2018-06-12", "state": "草稿", "indicators": [{"group_number":2, "data1": 20, "data2": 21, "data3": 0, "data4": 0, "meta_id": 1}], "members": ["oEvgD5p2WFnAXlrqrxd4GDlOgdx4"]}'