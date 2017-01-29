package com.inkren.skritter.plugins.core;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.net.Uri;

public class SkritterPlugin extends CordovaPlugin {

	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		super.initialize(cordova, webView);
	}

	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		if (action.equals("openGooglePlay")) {
			String packageName = args.getString(0);
			loadGooglePlay(packageName);
			return true;
		}
		if (action.equals("openPleco")) {
			String text = args.getString(0);
			if (isPackageInstalled("com.pleco.chinesesystem", cordova.getActivity())) {
				Intent plecoIntent = new Intent(Intent.ACTION_MAIN);
				plecoIntent.setComponent(new ComponentName("com.pleco.chinesesystem",
						"com.pleco.chinesesystem.PlecoDroidMainActivity"));
				plecoIntent.addCategory(Intent.CATEGORY_LAUNCHER);
				plecoIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP
						| Intent.FLAG_ACTIVITY_SINGLE_TOP);
				plecoIntent.putExtra("launch_section", "dictSearch");
				plecoIntent.putExtra("replacesearchtext", text);
				cordova.getActivity().startActivity(plecoIntent);
			} else {
				loadGooglePlay("com.pleco.chinesesystem");
			}
			return true;
		}
		return false;
	}

	private boolean isPackageInstalled(String packagename, Context context) {
		PackageManager manager = context.getPackageManager();
		try {
			manager.getPackageInfo(packagename, PackageManager.GET_ACTIVITIES);
			return true;
		} catch (NameNotFoundException e) {
			return false;
		}
	}
	
	private void loadGooglePlay(String packageName) {
		Intent intent = new Intent(Intent.ACTION_VIEW);
		intent.setData(Uri.parse("market://details?id=" + packageName));
		cordova.getActivity().startActivity(intent);
	}

}