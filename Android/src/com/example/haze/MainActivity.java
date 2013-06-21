package com.example.haze;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

public class MainActivity extends Activity {
	private Cache cache = null;
	public TextView hazard, value, time;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		Globals appState = ((Globals) getApplicationContext());
		cache = appState.getCache();

		hazard = (TextView) this.findViewById(R.id.txthazard);
		value = (TextView) this.findViewById(R.id.txtPSI);
		time = (TextView) this.findViewById(R.id.txtTime);

		new ConstantsGenerator(cache, this).execute();

		value.setText(String.valueOf(cache.latest_value));
		time.setText(cache.latest_time);

		if (cache.latest_value >= 0 && cache.latest_value <= 50) {
			hazard.setText("Good");
		} else if (cache.latest_value >= 51 && cache.latest_value <= 100) {
			hazard.setText("Moderate");
		} else if (cache.latest_value >= 101 && cache.latest_value <= 200) {
			hazard.setText("Unhealthy");
		} else if (cache.latest_value >= 201 && cache.latest_value <= 300) {
			hazard.setText("Very unhealthy");
		} else {
			hazard.setText("Hazardous");
		}

	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// Handle item selection
		switch (item.getItemId()) {
		case R.id.action_settings:
			openSettings();
			return true;
		case R.id.action_graph:
			openGraph();
			return true;
		default:
			return super.onOptionsItemSelected(item);
		}
	}

	void openSettings() {
		// Intent intent = new Intent(getApplicationContext(), Settings.class);
		// startActivity(intent);
	}

	void openGraph() {
		Intent intent = new Intent(getApplicationContext(), GraphActivity.class);
		startActivity(intent);
	}

}
