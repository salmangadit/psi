package com.example.haze;

import android.app.Application;

public class Globals extends Application {
	private Cache cache = new Cache();

	public Cache getCache() {
		return cache;
	}

	public void setCache(Cache c) {
		cache = c;
	}
}
