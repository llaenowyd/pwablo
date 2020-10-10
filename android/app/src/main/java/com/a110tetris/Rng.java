package com.a110tetris;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;

import java.nio.ByteBuffer;
import java.security.SecureRandom;

public class Rng extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private SecureRandom generator;
    private String initializationDiagnostic;

    private static final int min = Integer.valueOf(Short.MIN_VALUE);
    private static final int max = Integer.valueOf(Short.MAX_VALUE);
    private static final double drange = Double.valueOf(max - min);

    public Rng(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        try {
            generator = java.security.SecureRandom.getInstance("SHA1PRNG");
        } catch (java.lang.Exception e) {
            e.printStackTrace();
            initializationDiagnostic = e.getMessage();
        }
    }

    @Override
    public String getName() {
        return "Sha1";
    }

    @ReactMethod
    public void rand(int n, Promise promise) {
        if (generator == null) {
            promise.reject("Sha1", initializationDiagnostic);
            return;
        }
        if (n < 1) {
            promise.reject("Sha1", "bad input during 'rand'");
            return;
        }

        byte[] bytes = new byte[n * Short.BYTES];

        generator.nextBytes(bytes);

        WritableArray result = new WritableNativeArray();

        for (int i = 0; i < n; i++) {
            double d =
                Double.valueOf(
                        ByteBuffer.wrap(bytes, i * Short.BYTES, Short.BYTES).getShort() - min
                ) / drange;

            if (d >= 1.0) {
                promise.reject("Sha1", "generate error")
            }

            result.pushDouble(d);
        }

        promise.resolve(result);
    }
}
