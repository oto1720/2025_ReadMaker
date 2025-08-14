package com.readmaker;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class RustBridgeModule extends ReactContextBaseJavaModule {
    
    static {
        try {
            System.loadLibrary("readmaker_core");  // Rustライブラリ読み込み（libreadmaker_core.so）
        } catch (UnsatisfiedLinkError e) {
            // ライブラリが見つからない場合のログ出力
            android.util.Log.w("RustBridge", "Rust library not found: " + e.getMessage());
        }
    }
    
    // C FFI関数の宣言（Rustのlib.rsで定義済み）
    public native String jsAnalyzeText(String input);
    public native String jsTestBridge();
    public native void jsFreeString(long ptr);
    
    public RustBridgeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    
    @Override
    public String getName() {
        return "ReadMakerRustBridge";  // TypeScript側でNativeModules.ReadMakerRustBridgeとして参照
    }
    
    /**
     * 形態素解析実行
     * @param input 解析対象の日本語テキスト
     * @param promise React Nativeの非同期処理用Promise
     */
    @ReactMethod
    public void analyzeText(String input, Promise promise) {
        try {
            // 入力値検証
            if (input == null || input.trim().isEmpty()) {
                promise.resolve("[]");  // 空配列のJSON
                return;
            }
            
            // Rust関数呼び出し
            String result = jsAnalyzeText(input);
            
            if (result != null) {
                promise.resolve(result);  // JSON文字列を返却
            } else {
                promise.reject("ANALYSIS_ERROR", "Rust analysis returned null");
            }
        } catch (UnsatisfiedLinkError e) {
            // ネイティブライブラリが見つからない場合
            promise.reject("LIBRARY_ERROR", "Rust library not available: " + e.getMessage());
        } catch (Exception e) {
            // その他のエラー
            promise.reject("ANALYSIS_ERROR", "Analysis failed: " + e.getMessage());
        }
    }
    
    /**
     * ブリッジ接続テスト
     * @param promise React Nativeの非同期処理用Promise
     */
    @ReactMethod
    public void testBridge(Promise promise) {
        try {
            String result = jsTestBridge();
            
            if (result != null) {
                promise.resolve(result);
            } else {
                promise.reject("BRIDGE_ERROR", "Bridge test returned null");
            }
        } catch (UnsatisfiedLinkError e) {
            promise.reject("LIBRARY_ERROR", "Rust library not available: " + e.getMessage());
        } catch (Exception e) {
            promise.reject("BRIDGE_ERROR", "Bridge test failed: " + e.getMessage());
        }
    }
}
