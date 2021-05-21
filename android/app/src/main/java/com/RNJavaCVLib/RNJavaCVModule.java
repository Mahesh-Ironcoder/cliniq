package com.RNJavaCVLib;


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;


import android.content.Context;
import android.graphics.Bitmap;

import android.util.Log;
import android.media.ImageWriter;
/*
import org.opencv.core.CvType;
import org.opencv.core.Mat;

import org.opencv.android.Utils;
import org.opencv.imgproc.Imgproc;

*/


import org.bytedeco.javacv.AndroidFrameConverter;
import org.bytedeco.javacv.FFmpegFrameGrabber;
import org.bytedeco.javacv.Frame;
import org.bytedeco.javacv.Java2DFrameConverter;
//import org.bytedeco.opencv.opencv_core.Mat;
import java.io.File;
import java.io.FileOutputStream;


public class RNJavaCVModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public RNJavaCVModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNJavaCVLib";
    }

    @ReactMethod
    public void getFramesFromVideo(String fileName, Callback errorCallback, Callback successCallback){
        String LOGTAG = "RNJavaCV";
        String rootPath = reactContext.getFilesDir().getAbsolutePath();
        ShowFiles(LOGTAG);
        try{
            FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(fileName);
//            int count = 0;
            Frame frame;
//            Mat frameMat;
            String ofn;
//            OpenCVFrameConverter.ToMat converter = new OpenCVFrameConverter.ToMat();
            grabber.start();
            AndroidFrameConverter converter = new AndroidFrameConverter();
            Bitmap imgBitmap;
            for(int i = 0; i < 10; i++) {
//                frameMat = converter.convertToMat(frame);
                frame = grabber.grabImage();
                if(frame==null){
                    throw new Exception("Frame is null");
                }
                ofn = String.format("frame%03d.jpeg",i);
                Log.d(LOGTAG, "Frame at the path "+ofn+" is: "+ frame.toString());
//                reactContext.out
                FileOutputStream fos = reactContext.openFileOutput(ofn, Context.MODE_PRIVATE);
                imgBitmap = converter.convert(frame);
                imgBitmap.compress(Bitmap.CompressFormat.JPEG,90, fos);
                fos.flush();
                fos.close();
            }
            ShowFiles(LOGTAG);
            grabber.release();
            successCallback.invoke("Completed extracting ");
        }catch(Exception e){
            Log.d(LOGTAG, "Error in extracting: "+e.getMessage());
            errorCallback.invoke("Error in extracting: "+e.getMessage());
        }
//        try {
//            ShowFiles(LOGTAG);
//            DeinterlacedVideoPlayer videoPlayer = new DeinterlacedVideoPlayer(reactContext);
//            videoPlayer.start();
//            ShowFiles(LOGTAG);
//            successCallback.invoke("Filtered applied");
//        }catch (Exception e){
//            Log.d(LOGTAG, "Error in filtering "+e.getMessage());
//            errorCallback.invoke("Error in filtering "+e.getMessage());
//        }
    }

    private void ShowFiles(String LOGTAG) {
        File fd = reactContext.getFilesDir();
        for(File f: fd.listFiles()){
            Log.d(LOGTAG, "Files in filesDir: "+f.getName());
        }
    }

    @ReactMethod
    public void getFramesList(Callback errorCallback, Callback successCallback){
        try{
            File framesDir = new File(reactContext.getCacheDir(), "frames");
            WritableArray frameList = Arguments.createArray();
            for (File f : framesDir.listFiles()) {
                frameList.pushString(f.getName());
            }
            successCallback.invoke(frameList);
        }catch(Exception e){
            errorCallback.invoke("No frames in cache");
        }

    }
}
