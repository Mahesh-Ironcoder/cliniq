package com.RNJavaCVLib;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.graphics.Bitmap;
import android.os.AsyncTask;
import android.os.SystemClock;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.Nullable;

import org.bytedeco.javacv.AndroidFrameConverter;
import org.bytedeco.javacv.FFmpegFrameGrabber;
import org.bytedeco.javacv.Frame;
import org.bytedeco.javacv.FrameGrabber;
import org.bytedeco.javacv.OpenCVFrameConverter;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Point2f;
import static org.bytedeco.opencv.global.opencv_imgproc.*;

import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.SplittableRandom;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okio.BufferedSink;


//import com.otaliastudios.cameraview.CameraView;
//import com.otaliastudios.cameraview.frame.Frame;
//import com.otaliastudios.cameraview.frame.FrameProcessor;
//import com.otaliastudios.cameraview.size.Size;


public class RNJavaCVModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    public final static String LOG_TAG = "RNJavaCV";
    private final OpenCVFrameConverter.ToMat convertToMat;
    private Callback mSuccessCallback;
    private Callback mErrorCallback;
    private OkHttpClient httpClient;
    public RNJavaCVModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        convertToMat = new OpenCVFrameConverter.ToMat();
        httpClient = new OkHttpClient();
    }

    @Override
    public String getName() {
        return "RNJavaCVLib";
    }

    private void sendExtEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }


    @ReactMethod
    public void getRealTimeFrame(String camIndex, Callback errorCallback, Callback successCallback){
        Log.d(LOG_TAG, "Call to getRealTimeFrames" );
        try{
            AppCamera camera= new AppCamera(reactContext);
//            camera.openCamera();
            int i=1;
            File pDir = reactContext.getFilesDir();
            File appPhotos = new File(pDir,"Camera");
            String fileName;
            String filePath;
            boolean s = appPhotos.mkdir();

            while(i<150){
                fileName = String.format("photo%d.jpeg",i);
                filePath = new File(appPhotos, fileName).getAbsolutePath();
                camera.takePicture(new File(appPhotos, fileName).getAbsolutePath());
                WritableMap eventParams = Arguments.createMap();
                eventParams.putString("uriPath", filePath);
                eventParams.putBoolean("lastReq", false);
                sendExtEvent(reactContext,"frameEvent", eventParams);
                i++;
            }
//            camera.closeCamera();
            successCallback.invoke("Extracted 300 images into picture");
        }catch(Exception e){
            Log.d(LOG_TAG, "Error in cameraView: " + e.getMessage(),e.fillInStackTrace());
//            Log.
            errorCallback.invoke("Error in cameraView: " + e.getMessage());
        }

    }


    @ReactMethod
    public void getFramesFromVideo(String fileName, Callback errorCallback, Callback successCallback) {
        mSuccessCallback = successCallback;
        mErrorCallback = errorCallback;
        FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(fileName);
        try{
            ExtractFrameTask task = new ExtractFrameTask();
            task.execute(grabber);
        }catch(Exception e){
            Log.d(LOG_TAG, "Error in asyncTask"+e.getMessage(), e.fillInStackTrace());
            mErrorCallback.invoke("Error in asyncTask"+e.getMessage());
        }

    }

    private String sendPostRequest(String url, String body) throws IOException {
        RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"),body);
        Request postReq = new Request.Builder().url(url).addHeader("Content-Type", "application/json").post(requestBody).build();
        Response postResp = httpClient.newCall(postReq).execute();
        assert postResp.body() != null;
        return postResp.body().string();
    }

    private Frame rotateFrame(Frame frame, double angle) {
//        OpenCVFrameConverter.ToMat convertToMat = new OpenCVFrameConverter.ToMat();
        Mat matImage = convertToMat.convert(frame);
        Point2f centerPoint = new Point2f(matImage.cols() / 2.0f, matImage.rows() / 2.0f);
        Mat rot_mat = getRotationMatrix2D(centerPoint, angle, 1);
        warpAffine(matImage, matImage, rot_mat, matImage.size());
        return convertToMat.convert(matImage);
    }

    private String createImageFile(Frame frame, String filename) throws IOException {
        AndroidFrameConverter converter = new AndroidFrameConverter();
        Bitmap imgBitmap;
        File framesDir = createAndGetDir("frames");
        File framesFile = new File(framesDir, filename);
        FileOutputStream fos = new FileOutputStream(framesFile);
        imgBitmap = converter.convert(frame);
        imgBitmap.compress(Bitmap.CompressFormat.PNG, 100, fos);
        fos.flush();
        fos.close();
//        imgBitmap.
        return framesDir.getAbsolutePath();
    }

    private File createAndGetDir(String directoryName) throws IOException {
        File directory = new File(reactContext.getFilesDir(), directoryName);
        boolean success = directory.mkdir();
        // if(!success) throw new IOException("Not able to create frames directory");
        return directory;
    }

    private void ShowFiles(String tag) throws Exception {
        File fd = new File(reactContext.getFilesDir(), "frames");
        File[] filesList = fd.listFiles();
        assert filesList != null;
        if (filesList.length <= 0) {
            throw new Exception("No files in the Dir frames. ");
        }
        for (File f : filesList) {
            Log.d(tag, "Files in filesDir: " + f.getName());
        }
    }

    private void StopConverting(FFmpegFrameGrabber grabber) {
        try {
            grabber.stop();
            grabber.release();
        } catch (FrameGrabber.Exception e) {
            throw new RuntimeException("Could not stop or release the resources: " + e.getMessage());
        }
    }

    private String convertFrameToBase64(Frame frame){
        AndroidFrameConverter converter = new AndroidFrameConverter();
        Bitmap frameBitmap = converter.convert(frame);
        ByteArrayOutputStream frameByte = new ByteArrayOutputStream();
        frameBitmap.compress(Bitmap.CompressFormat.PNG,99,frameByte);
        return Base64.encodeToString(frameByte.toByteArray(),Base64.DEFAULT);
    }

    private String bodyJson(int status, String photoFrame){
        return  "{" +
                "'name': 'something'," +
                "'id': '4'," +
                "'pms': 'uk'," +
                "'status': " + status +","+
                "photo" +photoFrame+","+
                "}" ;
    }

    private class ExtractFrameTask extends AsyncTask<FFmpegFrameGrabber, String, WritableMap>
    {

        @Override
        protected WritableMap doInBackground(FFmpegFrameGrabber... fFmpegFrameGrabbers) {
            Frame frame;
            String ofn;
            int i = 1;
            FFmpegFrameGrabber grabber = fFmpegFrameGrabbers[0];
            String framesDirectory;
            String URL = "http://15.207.11.162:8500/data/uploadPhoto";
            String result;
            long start, stop;
            long frameTime, reqTime;
            try{
                grabber.start();
                start = System.currentTimeMillis();
                while ((frame = grabber.grabImage()) != null) {
                    ofn = String.format("frame%03d.png", i);
                    frame = rotateFrame(frame, 90);
                    stop = System.currentTimeMillis();
                    frameTime = (stop-start);
                    start = System.currentTimeMillis();
                    result = sendPostRequest(URL, bodyJson(1, convertFrameToBase64(frame)));
                    stop = System.currentTimeMillis();
                    reqTime = (stop-start);
//                    framesDirectory = createImageFile(frame, ofn);
//                    publishProgress(framesDirectory + "/" + ofn, String.valueOf(i),String.valueOf(false));
                    publishProgress("frame time: "+frameTime+"Request Time: "+reqTime+result);
                    i++;

                }
            } catch (FrameGrabber.Exception e) {
                String errMsg = "Error in frame grabs: " + e.getMessage();
                Log.d(LOG_TAG, errMsg);
                cancel(true);
                if(mErrorCallback!=null){
                    mErrorCallback.invoke(errMsg);
                    mErrorCallback = null;
                }
            } catch (IOException e) {
                String errMsg = "Error in file creations: " + e.getMessage();
                Log.d(LOG_TAG, errMsg);
                cancel(true);
                if(mErrorCallback!=null){
                    mErrorCallback.invoke(errMsg);
                    mErrorCallback = null;
                }
            } catch (Exception e) {
                String errMsg = "Error in extracting: " + e.getMessage();
                Log.d(LOG_TAG, errMsg);
                cancel(true);
                if(mErrorCallback!=null){
                    mErrorCallback.invoke(errMsg);
                    mErrorCallback = null;
                }
            }
            WritableMap completeParams = Arguments.createMap();
            completeParams.putString("msg", "Completed Task of extracting frames");
            completeParams.putBoolean("lastReq", true);

            return completeParams;
        }

        @Override
        protected void onProgressUpdate(String... progress){
//            String filePath = progress[0];
//            String frameNo = progress[1];
//            String lastReq = progress[2];
//
            WritableMap eventParams = Arguments.createMap();
//            eventParams.putString("uriPath", filePath);
//            eventParams.putBoolean("lastReq", Boolean.parseBoolean(lastReq));
//            eventParams.putInt("currFrame", Integer.parseInt(frameNo));
            eventParams.putString("result", progress[0]);
            sendExtEvent(reactContext, "frameEvent", eventParams);
        }

        @Override
        protected  void onPostExecute(WritableMap result){
            if(mSuccessCallback!=null){
                mSuccessCallback.invoke(result);
                mSuccessCallback = null;
            }
        }
    }
    /*private void ShowFiles(String dirPath) throws Exception {
        if(dirPath.isEmpty()){
            Log.d(LOG_TAG, "NO path file ");
            return;
        }
        File appPhotos = new File(dirPath);
        File[] filesList = appPhotos.listFiles();
        assert filesList != null;
        if (filesList.length <= 0) {
            throw new Exception("No files in the Dir frames. ");
        }
        for (File f : filesList) {
            Log.d(LOG_TAG, "Files in filesDir: " + f.getName());
        }
    }*/

}

/*    @ReactMethod
    public void getRealTimeFrame(String camIndex, Callback errorCallback, Callback successCallback){
        Log.d(LOG_TAG, "Called to getRealTime frame method: ");
        try{

            mCamera.addFrameProcessor(new FrameProcessor() {
                @Override
                @WorkerThread
                public void process(@NonNull Frame frame) {
                    long time = frame.getTime();
                    Size size = frame.getSize();
                    int format = frame.getFormat();
                    int userRotation = frame.getRotationToUser();
                    int viewRotation = frame.getRotationToView();
                    String outputPath = "";
                    try{
                        if (frame.getDataClass() == byte[].class) {
                            byte[] data = frame.getData();
                            outputPath = processByteFrame(data);
                        } else if (frame.getDataClass() == Image.class) {
                            Image data = frame.getData();
                            outputPath =processImageFrame(data);
                        }
                        ShowFiles(outputPath);
                    }catch (IOException e){
                        Log.d(LOG_TAG, "IOError in processing frame: " + e.getMessage());
                        errorCallback.invoke("IOError in processing frame: " + e.getMessage());
                    }catch (Exception e){
                        Log.d(LOG_TAG, "Error in processing frame: " + e.getMessage());
                        errorCallback.invoke("Error in processing frame: " + e.getMessage());
                    }
                }
            });
        } catch (Exception e){
            Log.d(LOG_TAG, "Error in cameraView: " + e.getMessage());
            errorCallback.invoke("Error in cameraView: " + e.getMessage());
        }
    }

    private String processByteFrame(byte[] frameData) throws IOException {
        Bitmap bitmapFrame = BitmapFactory.decodeByteArray(frameData,0,frameData.length);
        File pDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);
        File appPhotos = new File(new File(pDir,"CliniQ"),"camera");
        FileOutputStream fos = new FileOutputStream(appPhotos);
        bitmapFrame.compress(Bitmap.CompressFormat.PNG, 99, fos);
        fos.flush();
        return appPhotos.getAbsolutePath();
    }

    private String processImageFrame(Image imgData) throws IOException {
        ByteBuffer buffer = imgData.getPlanes()[0].getBuffer();
        byte[] bytes = new byte[buffer.capacity()];
        buffer.get(bytes);
        return processByteFrame(bytes);
    }

    private void ShowFiles(String dirPath) throws Exception {
        if(dirPath.isEmpty()){
            Log.d(LOG_TAG, "NO path file ");
            return;
        }
        File appPhotos = new File(dirPath);
        File[] filesList = appPhotos.listFiles();
        assert filesList != null;
        if (filesList.length <= 0) {
            throw new Exception("No files in the Dir frames. ");
        }
        for (File f : filesList) {
            Log.d(LOG_TAG, "Files in filesDir: " + f.getName());
        }
    }*/
/*
    @ReactMethod
    public void getFramesFromVideo(String fileName, Callback errorCallback, Callback successCallback) {

        FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(fileName);
        try {
            Frame frame;
            String ofn;
            int i = 1;

            String framesDirectory;
            grabber.start();

            while ((frame = grabber.grabImage()) != null) {
                ofn = String.format("frame%03d.png", i);
                frame = rotateFrame(frame, 90);
                framesDirectory = createImageFile(frame, ofn);
                WritableMap eventParams = Arguments.createMap();
                eventParams.putString("uriPath", framesDirectory + "/" + ofn);
                eventParams.putBoolean("lastReq", false);
                sendExtEvent(reactContext, "frameEvent", eventParams);
                i++;
                // Thread.sleep(5000);
            }

            WritableMap completeParams = Arguments.createMap();
            completeParams.putBoolean("lastReq", true);
            sendExtEvent(reactContext, "frameEvent", completeParams);

            ShowFiles(LOG_TAG);
            StopConverting(grabber);
            successCallback.invoke(completeParams);
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

    private Frame rotateFrame(Frame frame, double angle) {
//        OpenCVFrameConverter.ToMat convertToMat = new OpenCVFrameConverter.ToMat();
        Mat matImage = convertToMat.convert(frame);
        Point2f centerPoint = new Point2f(matImage.cols() / 2.0f, matImage.rows() / 2.0f);
        Mat rot_mat = getRotationMatrix2D(centerPoint, angle, 1);
        warpAffine(matImage, matImage, rot_mat, matImage.size());
        return convertToMat.convert(matImage);
    }

    private String createImageFile(Frame frame, String filename) throws IOException {
        AndroidFrameConverter converter = new AndroidFrameConverter();
        Bitmap imgBitmap;
        File framesDir = createAndGetDir("frames");
        File framesFile = new File(framesDir, filename);
        FileOutputStream fos = new FileOutputStream(framesFile);
        imgBitmap = converter.convert(frame);
        imgBitmap.compress(Bitmap.CompressFormat.PNG, 100, fos);
        fos.flush();
        fos.close();
        return framesDir.getAbsolutePath();
    }

    private File createAndGetDir(String directoryName) throws IOException {
        File directory = new File(reactContext.getFilesDir(), directoryName);
        boolean success = directory.mkdir();
        // if(!success) throw new IOException("Not able to create frames directory");
        return directory;
    }

    private void ShowFiles(String tag) throws Exception {
        File fd = new File(reactContext.getFilesDir(), "frames");
        File[] filesList = fd.listFiles();
        assert filesList != null;
        if (filesList.length <= 0) {
            throw new Exception("No files in the Dir frames. ");
        }
        for (File f : filesList) {
            Log.d(tag, "Files in filesDir: " + f.getName());
        }
    }

    private void StopConverting(FFmpegFrameGrabber grabber) {
        try {
            grabber.stop();
            grabber.release();
        } catch (FrameGrabber.Exception e) {
            throw new RuntimeException("Could not stop or release the resources: " + e.getMessage());
        }
    }*/
