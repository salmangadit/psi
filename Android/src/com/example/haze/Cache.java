package com.example.haze;

import java.util.ArrayList;
import java.util.List;

public class Cache {
	public String latest_time = "Loading";
	public Integer latest_value = 0;
	public String latest_date = "Loading";
	
	public List<PSIValue> last_ten_readings = new ArrayList<PSIValue>();
}
