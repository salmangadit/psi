package com.example.haze;

import java.io.IOException;
import java.io.InputStream;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
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
	static JSONObject jObj = null;
	ProgressDialog progressDialog;
	MainActivity main = null;
	String endpoint;

	public ConstantsGenerator(Cache con, MainActivity main) {
		cache = con;
		this.main = main;
		endpoint = "http://nameless-scrubland-5187.herokuapp.com";
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
				endpoint + "/latest");
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
				jObj = new JSONObject(results);

			} catch (JSONException e) {
				// TODO Auto-generated catch block
				Log.e("JSON Parser", "Error parsing data " + e.toString());
				e.printStackTrace();

			}

			try {
					cache.latest_value = Integer.parseInt(jObj.getString("reading"));
					cache.latest_time =  jObj.getString("time");
					main.time.setText(jObj.getString("time"));
					main.value.setText(jObj.getString("reading"));
					
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
