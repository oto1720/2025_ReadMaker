#import "RustBridge.h"
#import <React/RCTUtils.h>

// Rustの関数宣言（native/rust/src/lib.rsで定義済み）
extern char* js_analyze_text(const char* input);
extern char* js_test_bridge(void);
extern void js_free_string(char* ptr);

@implementation RustBridge

// React Nativeモジュール名を設定（TypeScript側でNativeModules.ReadMakerRustBridgeとして参照）
RCT_EXPORT_MODULE(ReadMakerRustBridge);

/**
 * 形態素解析実行
 * @param input 解析対象の日本語テキスト
 * @param resolve Promise resolve コールバック
 * @param reject Promise reject コールバック
 */
RCT_EXPORT_METHOD(analyzeText:(NSString *)input
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    // 入力値検証
    if (!input || input.length == 0) {
        resolve(@"[]");  // 空配列のJSON
        return;
    }
    
    // NSString → C文字列変換
    const char* c_input = [input UTF8String];
    
    // Rust関数呼び出し
    char* result = js_analyze_text(c_input);
    
    if (result) {
        // C文字列 → NSString変換
        NSString* nsResult = [NSString stringWithUTF8String:result];
        
        // Rustで確保されたメモリを解放
        js_free_string(result);
        
        resolve(nsResult);
    } else {
        reject(@"ANALYSIS_ERROR", @"Rust analysis returned null", nil);
    }
}

/**
 * ブリッジ接続テスト
 * @param resolve Promise resolve コールバック
 * @param reject Promise reject コールバック
 */
RCT_EXPORT_METHOD(testBridge:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    // Rust関数呼び出し
    char* result = js_test_bridge();
    
    if (result) {
        // C文字列 → NSString変換
        NSString* nsResult = [NSString stringWithUTF8String:result];
        
        // Rustで確保されたメモリを解放
        js_free_string(result);
        
        resolve(nsResult);
    } else {
        reject(@"BRIDGE_ERROR", @"Bridge test returned null", nil);
    }
}

@end
