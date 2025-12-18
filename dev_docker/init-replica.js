rs.initiate()

const PRIMARY = 1
while (rs.status().myState !== PRIMARY) { sleep(200) } // don't busy-spin
