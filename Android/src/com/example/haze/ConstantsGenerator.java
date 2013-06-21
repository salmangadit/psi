package com.example.haze;

import java.io.IOException;
import java.io.InputStream;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.ProgressDialog;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.ImageView;

public class ConstantsGenerator extends AsyncTask<Void, Void, String> {
	private Cache cache = null;
	private static String TAG = "ARMSMobile.java";
	static JSONArray jObj = null;
	ProgressDialog progressDialog;
	MainActivity main = null;
	String endpoint;

	public ConstantsGenerator(Cache con, MainActivity main) {
		cache = con;
		this.main = main;
		endpoint = "http://arcane-lake-8112.herokuapp.com";
	}

	@Override
	protected void onPreExecute() {
		progressDialog = ProgressDialog.show(main, "Loading latest PSI value...", "", true);
	};

	@Override
	protected String doInBackground(Void... arg0) {
		HttpClient httpClient = new DefaultHttpClient();
		// HttpContext localContext = new BasicHttpContext();
		HttpGet httpGet = new HttpGet(
				endpoint + "/list");
		String text = null;
		try {
			HttpResponse response = httpClient.execute(httpGet);
			HttpEntity entity = response.getEntity();
			text = getASCIIContentFromEntity(entity);
		} catch (Exception e) {
			return e.getLocalizedMessage();
		}
		return text;
	}

	@Override
	protected void onPostExecute(String results) {
		Log.v(TAG, "Response string: " + results);
		if (results != null) {
			try {
				jObj = new JSONArray(results);

			} catch (JSONException e) {
				// TODO Auto-generated catch block
				Log.e("JSON Parser", "Error parsing data " + e.toString());
				e.printStackTrace();

			}

			try {
				if (jObj.getJSONObject(0).getString("reading") != "-"){
					cache.latest_value = Integer.parseInt(jObj.getJSONObject(0).getString("reading"));
				} else {
					cache.latest_value = -1;
				}
					cache.latest_time =  jObj.getJSONObject(0).getString("time");
					main.time.setText(jObj.getJSONObject(0).getString("time"));
					main.value.setText(jObj.getJSONObject(0).getString("reading"));
					
					if (cache.latest_value == -1){
						main.hazard.setText("Server problems. Value unreadable.");
					}
					if (cache.latest_value >= 0 && cache.latest_value <= 50){
						main.hazard.setText("Good");
					} else if (cache.latest_value >= 51 && cache.latest_value <= 100){
						main.hazard.setText("Moderate");
					} else if (cache.latest_value >= 101 && cache.latest_value <= 200){
						main.hazard.setText("Unhealthy");
					} else if (cache.latest_value >= 201 && cache.latest_value <= 300){
						main.hazard.setText("Very unhealthy");
					} else {
						main.hazard.setText("Hazardous");
					} 
					
					for (int i = 0; i<jObj.length(); i++){
						PSIValue val = new PSIValue();
						val.time = jObj.getJSONObject(i).getString("time");
						if (jObj.getJSONObject(i).getString("reading") != "-"){
							val.value = Integer.parseInt(jObj.getJSONObject(i).getString("reading"));
						} else {
							val.value = -1;
						}
						
						cache.last_ten_readings.add(val);
					}
					
					Globals appState = ((Globals) main.getApplicationContext());
					appState.setCache(cache);

			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}

		progressDialog.dismiss();


	}

	protected String getASCIIContentFromEntity(HttpEntity entity)
			throws IllegalStateException, IOException {
		InputStream in = entity.getContent();
		StringBuffer out = new StringBuffer();
		int n = 1;
		while (n > 0) {
			byte[] b = new byte[4096];
			n = in.read(b);
			if (n > 0)
				out.append(new String(b, 0, n));
		}
		return out.toString();
	}
}
