#!/bin/bash

#declare -a keys=(
#	"salary_selection"
#	"district_selection"
#	"render"
#	"gender_selection"
#	"area_selection"
#	"region_selection"
#	"UUID setting error"
#	"share"
#)
#for k in "${keys[@]}"
#do
#	echo "$k:$number"
#	sleep 2
#done

#	number=`$psql_cmd "select count(*) from event where eventname='salary360'" | head -n3 | tail -n1`
#	echo "Number:"$number

psql_cmd="psql -A -F":" -h localhost -p 5432 -d memory_db -U memory -a -c "

while [[ true ]]; do
	#$psql_cmd "select key,count(*) from event where eventname='salary360' group by key;" | tail -n +3 | head -n -1
	$psql_cmd "select key,count(*) from event where eventname='salary360' and id>1172476 group by key;" | tail -n +3 | head -n -1
	sleep 5
done

