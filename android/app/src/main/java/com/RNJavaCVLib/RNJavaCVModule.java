package com.RNJavaCVLib;


import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.content.Context;
import android.graphics.Bitmap;
import android.util.Log;

import org.bytedeco.javacv.AndroidFrameConverter;
import org.bytedeco.javacv.FFmpegFrameGrabber;
import org.bytedeco.javacv.Frame;
import org.bytedeco.javacv.FrameGrabber;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;


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
    public void getFramesFromVideo(String fileName, Callback errorCallback, Callback successCallback) {
        String LOGTAG = "RNJavaCV";
//        ShowFiles(LOGTAG);
        FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(fileName);
        try {
            Frame frame;
            String ofn;

            grabber.start();

//            File framesDir = createAndGetDir("frames");
            frame = grabber.grabImage();
            int i = 1;
          /*  for(int i = 0; i<350;i++) {
                frame = grabber.grabImage();
                if (frame == null) {
                    break;
                }
                ofn = String.format("frame%03d.jpeg", i);
                createFiles(frame, ofn);
            }*/
            while(frame != null){
                ofn = String.format("frame%03d.jpeg", i);
                createFiles(frame, ofn);
                i++;
                frame = grabber.grabImage();
            }

            ShowFiles(LOGTAG);
            StopConverting(grabber);
            successCallback.invoke("Completed extracting ");
        } catch (FrameGrabber.Exception e) {
            String errMsg = "Error in frame grabs: " + e.getMessage();
            Log.d(LOGTAG, errMsg);
            errorCallback.invoke(errMsg);
        } catch (IOException e) {
            String errMsg = "Error in file creations: " + e.getMessage();
            Log.d(LOGTAG, errMsg);
            errorCallback.invoke(errMsg);
        } catch (Exception e) {
            Log.d(LOGTAG, "Error in extracting: " + e.getMessage());
            errorCallback.invoke("Error in extracting: " + e.getMessage());
        }
//        finally {
//            reactContext.deleteFile(fileName);
//        }
    }

    private File createAndGetDir(String directoryName){
        File directory = new File(reactContext.getFilesDir(), directoryName);
//        if(!directory.exists()){
        directory.mkdir();
//        }
        return  directory;
    }

    private void createFiles(Frame frame, String filename) throws IOException {
        AndroidFrameConverter converter = new AndroidFrameConverter();
        Bitmap imgBitmap;
        File framesDir = createAndGetDir("frames");
        File framesFile = new File(framesDir, filename);
        FileOutputStream fos = new FileOutputStream(framesFile);
        imgBitmap = converter.convert(frame);
        imgBitmap.compress(Bitmap.CompressFormat.JPEG, 90, fos);
        fos.flush();
        fos.close();
    }

    private void ShowFiles(String LOGTAG) {
        File fd = new File(reactContext.getFilesDir(), "frames");
        for(File f: fd.listFiles()){
            Log.d(LOGTAG, "Files in filesDir: "+f.getName());
        }
    }

    private void StopConverting(FFmpegFrameGrabber grabber){
        try{
            grabber.stop();
            grabber.release();
        }catch (FrameGrabber.Exception e){
            throw new RuntimeException("Could not stop or release the resources: "+e.getMessage());
        }
    }

}
