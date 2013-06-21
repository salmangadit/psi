package com.example.haze;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.androidplot.series.XYSeries;
import com.androidplot.xy.LineAndPointFormatter;
import com.androidplot.xy.XYPlot;
import com.androidplot.xy.SimpleXYSeries;
import com.androidplot.xy.BarFormatter;

import android.app.ActionBar;
import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.view.Menu;

public class GraphActivity extends Activity {

	private XYPlot mySimpleXYPlot;
	private Cache cache = null;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_graph);

		Globals appState = ((Globals) getApplicationContext());
		cache = appState.getCache();

		// initialize our XYPlot reference:
		mySimpleXYPlot = (XYPlot) findViewById(R.id.PSIgraph);

		// Create a couple arrays of y-values to plot:
		List<Number> series1Numbers = new ArrayList<Number>();

		for (int i = 0; i < cache.last_ten_readings.size(); i++) {
			series1Numbers.add((Number) cache.last_ten_readings.get(i).value);
		}

		// Turn the above arrays into XYSeries':
		XYSeries series1 = new SimpleXYSeries(series1Numbers, // SimpleXYSeries
																// takes a List
																// so turn our
																// array into a
																// List
				SimpleXYSeries.ArrayFormat.Y_VALS_ONLY, // Y_VALS_ONLY means use
														// the element index as
														// the x value
				"Series1"); // Set the display title of the series

		// Create a formatter to use for drawing a series using
		// LineAndPointRenderer:
		BarFormatter series1Format = new BarFormatter(Color.rgb(0, 200, 0), // fill
																			// color
				Color.rgb(0, 100, 0)); // border color

		// add a new series' to the xyplot:
		mySimpleXYPlot.addSeries(series1, series1Format);

		// reduce the number of range labels
		mySimpleXYPlot.setTicksPerRangeLabel(3);

		// by default, AndroidPlot displays developer guides to aid in laying
		// out your plot.
		// To get rid of them call disableAllMarkup():
		mySimpleXYPlot.disableAllMarkup();
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.graph, menu);
		return true;
	}
}
