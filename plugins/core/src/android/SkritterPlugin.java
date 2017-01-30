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
        if (action.equals("isPackageInstalled")) {
            String packageName = args.getString(0);

            if (isPackageInstalled(packageName, cordova.getActivity())) {
                callbackContext.success(packageName);
            } else {
                callbackContext.error(packageName);
            }

            return true;
        }

        if (action.equals("openGooglePlay")) {
            loadGooglePlay(args.getString(0));

            return true;
        }

        if (action.equals("openHanpingLite")) {
            String text = args.getString(0);
            String componentName = "com.embermitre.hanping.app.lite";

            if (isPackageInstalled(componentName, cordova.getActivity())) {
                Intent hanpingIntent = new Intent(Intent.ACTION_MAIN);

                hanpingIntent.setComponent(new ComponentName(componentName, "com.embermitre.dictroid.ui.RedirectActivity"));
                hanpingIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                hanpingIntent.setData(Uri.parse("dictroid:/cmn/word/" + text));

                cordova.getActivity().startActivity(hanpingIntent);
            }
        }

        if (action.equals("openHanpingPro")) {
            String text = args.getString(0);
            String componentName = "com.embermitre.hanping.app.pro";

            if (isPackageInstalled(componentName, cordova.getActivity())) {
                Intent hanpingIntent = new Intent(Intent.ACTION_MAIN);

                hanpingIntent.setComponent(new ComponentName(componentName, "com.embermitre.dictroid.ui.RedirectActivity"));
                hanpingIntent.addCategory(Intent.CATEGORY_LAUNCHER);
                hanpingIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                hanpingIntent.setData(Uri.parse("dictroid:/cmn/word/" + text));

                cordova.getActivity().startActivity(hanpingIntent);
            }
        }

        if (action.equals("openHanpingYue")) {
            String text = args.getString(0);
            String componentName = "com.embermitre.hanping.cantodict.app.pro";

            if (isPackageInstalled(componentName, cordova.getActivity())) {
                Intent hanpingIntent = new Intent(Intent.ACTION_MAIN);

                hanpingIntent.setComponent(new ComponentName(componentName, "com.embermitre.dictroid.ui.RedirectActivity"));
                hanpingIntent.addCategory(Intent.CATEGORY_LAUNCHER);
                hanpingIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                hanpingIntent.setData(Uri.parse("dictroid:/yue/word/" + text));

                cordova.getActivity().startActivity(hanpingIntent);
            }

            return true;
        }

        if (action.equals("openPleco")) {
            String text = args.getString(0);
            String componentName = "com.pleco.chinesesystem";

            if (isPackageInstalled(componentName, cordova.getActivity())) {
                Intent plecoIntent = new Intent(Intent.ACTION_MAIN);

                plecoIntent.setComponent(new ComponentName(componentName, "com.pleco.chinesesystem.PlecoDroidMainActivity"));
                plecoIntent.addCategory(Intent.CATEGORY_LAUNCHER);
                plecoIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                plecoIntent.putExtra("launch_section", "dictSearch");
                plecoIntent.putExtra("replacesearchtext", text);

                cordova.getActivity().startActivity(plecoIntent);
            }

            return true;
        }

        return false;
    }

    private boolean isPackageInstalled(String packageName, Context context) {
        PackageManager manager = context.getPackageManager();

        try {
            manager.getPackageInfo(packageName, PackageManager.GET_ACTIVITIES);

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
