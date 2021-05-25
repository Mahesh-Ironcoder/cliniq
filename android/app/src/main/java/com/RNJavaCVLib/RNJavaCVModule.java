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
import org.bytedeco.javacv.OpenCVFrameConverter;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Point2f;

import static org.bytedeco.opencv.global.opencv_imgproc.*;

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
        String LOG_TAG = "RNJavaCV";
        FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(fileName);
        try {
            Frame frame;
            String ofn;


            grabber.start();
            int i = 1;

            while((frame=grabber.grabImage()) != null){
                ofn = String.format("frame%03d.jpeg", i);
                frame = rotateFrame(frame, 90);
                createFiles(frame, ofn);
                i++;
            }

            ShowFiles(LOG_TAG);
            StopConverting(grabber);
            successCallback.invoke("Completed extracting ");
        } catch (FrameGrabber.Exception e) {
            String errMsg = "Error in frame grabs: " + e.getMessage();
            Log.d(LOG_TAG, errMsg);
            errorCallback.invoke(errMsg);
        } catch (IOException e) {
            String errMsg = "Error in file creations: " + e.getMessage();
            Log.d(LOG_TAG, errMsg);
            errorCallback.invoke(errMsg);
        } catch (Exception e) {
            Log.d(LOG_TAG, "Error in extracting: " + e.getMessage());
            errorCallback.invoke("Error in extracting: " + e.getMessage());
        }
    }

    private Frame rotateFrame(Frame frame, double angle){
        OpenCVFrameConverter.ToMat convertToMat = new OpenCVFrameConverter.ToMat();
        Mat matImage = convertToMat.convert(frame);
        Point2f centerPoint = new Point2f(matImage.cols()/2.0f, matImage.rows()/2.0f);
        Mat rot_mat = getRotationMatrix2D(centerPoint,angle,1);
        warpAffine(matImage, matImage, rot_mat,matImage.size());
        return convertToMat.convert(matImage);
    }

    private File createAndGetDir(String directoryName) throws IOException {
        File directory = new File(reactContext.getFilesDir(), directoryName);
        boolean success = directory.mkdir();
//        if(!success) throw new IOException("Not able to create frames directory");
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

    private void ShowFiles(String tag) throws Exception {
        File fd = new File(reactContext.getFilesDir(), "frames");
        File[] filesList = fd.listFiles();
        assert filesList != null;
        if (filesList.length <= 0) {
                throw new Exception("No files in the Dir frames. ");
        }
        for(File f: filesList){
            Log.d(tag, "Files in filesDir: "+f.getName());
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
