package com.RNJavaCVLib;

import com.facebook.react.bridge.ReactContext;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.ImageFormat;
import android.hardware.camera2.*;
import android.media.Image;
import android.media.ImageReader;
import android.os.Environment;
import android.os.Handler;
import android.os.HandlerThread;
import android.util.Log;
import android.util.Size;
import android.util.SparseIntArray;
import android.view.Display;
import android.view.Surface;
import android.view.WindowManager;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;

public class AppCamera {

    //==============================
    //        Class members
    //==============================
    private CameraDevice cameraDevice;
    private final CameraManager manager;
    private final ReactContext _context;
    private final static String LOG_TAG = "APP_CAMERA";
    private Handler mBackgroundHandler;
    private HandlerThread mBackgroundThread;
    private static final SparseIntArray ORIENTATIONS = new SparseIntArray();
    static {
        ORIENTATIONS.append(Surface.ROTATION_0, 90);
        ORIENTATIONS.append(Surface.ROTATION_90, 0);
        ORIENTATIONS.append(Surface.ROTATION_180, 270);
        ORIENTATIONS.append(Surface.ROTATION_270, 180);
    }
    private String cameraId;
    private Size imageDimension;

    //==============================
    //        Class Constructors
    //==============================
    public AppCamera(ReactContext context) {
        this._context = context;
        manager = (CameraManager) _context.getSystemService(Context.CAMERA_SERVICE);
        startBackgroundThread();
        openCamera();
    }

    //==============================
    //        Utilities
    //==============================
    private final CameraDevice.StateCallback stateCallback = new CameraDevice.StateCallback() {
        @Override
        public void onOpened(CameraDevice camera) {
            //This is called when the camera is open
            Log.e(LOG_TAG, "onOpened");
            cameraDevice = camera;
        }

        @Override
        public void onDisconnected(CameraDevice camera) {
            cameraDevice.close();
        }

        @Override
        public void onError(CameraDevice camera, int error) {
            cameraDevice.close();
            cameraDevice = null;
        }
    };

    protected void startBackgroundThread() {
        mBackgroundThread = new HandlerThread("Camera Background");
        mBackgroundThread.start();
        mBackgroundHandler = new Handler(mBackgroundThread.getLooper());
    }

    protected void stopBackgroundThread() {
        mBackgroundThread.quitSafely();
        try {
            mBackgroundThread.join();
            mBackgroundThread = null;
            mBackgroundHandler = null;
        } catch (InterruptedException e) {
            Log.d(LOG_TAG, "INtrupption error in thread close: "+e.getMessage(),e.fillInStackTrace());
        }
    }


    //==============================
    //        Public Methods
    //==============================
    public void takePicture(String filePath) {
//        if (null == cameraDevice) {
//            Log.e(LOG_TAG, "cameraDevice is null");
//            return;
//        }
        CameraManager manager = (CameraManager) _context.getSystemService(Context.CAMERA_SERVICE);
        try {
            CameraCharacteristics characteristics = manager.getCameraCharacteristics(cameraDevice.getId());
            Size[] jpegSizes = null;
            if (characteristics != null) {
                jpegSizes = characteristics.get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP).getOutputSizes(ImageFormat.JPEG);
            }
            int width = 640;
            int height = 480;
            if (jpegSizes != null && 0 < jpegSizes.length) {
                width = jpegSizes[0].getWidth();
                height = jpegSizes[0].getHeight();
            }
            ImageReader reader = ImageReader.newInstance(width, height, ImageFormat.JPEG, 5);
            List<Surface> outputSurfaces = new ArrayList<Surface>(1);
            outputSurfaces.add(reader.getSurface());
            final CaptureRequest.Builder captureBuilder = cameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_STILL_CAPTURE);
//            CameraDevice.
            captureBuilder.addTarget(reader.getSurface());
            captureBuilder.set(CaptureRequest.CONTROL_MODE, CameraMetadata.CONTROL_MODE_AUTO);

            // Orientation
            Display display = ((WindowManager) _context.getSystemService(Context.WINDOW_SERVICE)).getDefaultDisplay();
            int rotation = display.getRotation();
            captureBuilder.set(CaptureRequest.JPEG_ORIENTATION, ORIENTATIONS.get(rotation));

            //Directory to store images
            File file = new File(filePath);

            //listens to the new frame arrival and write to the above file.
            ImageReader.OnImageAvailableListener readerListener = new ImageReader.OnImageAvailableListener() {
                @Override
                public void onImageAvailable(ImageReader reader) {
                    Image image = null;
                    try {
                        image = reader.acquireLatestImage();
                        ByteBuffer buffer = image.getPlanes()[0].getBuffer();
                        byte[] bytes = new byte[buffer.capacity()];
                        buffer.get(bytes);
                        save(bytes);
                    } catch (FileNotFoundException e) {
                        Log.d(LOG_TAG, "Error in Finding the file: " + e.getMessage(), e.fillInStackTrace());
                    } catch (IOException e) {
                        Log.d(LOG_TAG, "IOError in while saving the file: " + e.getMessage(), e.fillInStackTrace());
                    } finally {
                        if (image != null) {
                            image.close();
                        }
                    }
                }

                private void save(byte[] bytes) throws IOException {
                    OutputStream output = null;
                    try {
                        output = new FileOutputStream(file);
                        output.write(bytes);
                    } finally {
                        if (null != output) {
                            output.close();
                        }
                    }
                }
            };
            reader.setOnImageAvailableListener(readerListener, mBackgroundHandler);

            //Listens to the frame capture in the session
            final CameraCaptureSession.CaptureCallback captureListener = new CameraCaptureSession.CaptureCallback() {
                @Override
                public void onCaptureCompleted(CameraCaptureSession session, CaptureRequest request, TotalCaptureResult result) {
                    super.onCaptureCompleted(session, request, result);
                    Log.d(LOG_TAG, "Saved ");
                }
            };

            //A callback when the state is configured
            CameraCaptureSession.StateCallback sessionStateCallBack = new CameraCaptureSession.StateCallback() {
                @Override
                public void onConfigured(CameraCaptureSession session) {
                    try {
                        session.capture(captureBuilder.build(), captureListener, mBackgroundHandler);
                    } catch (CameraAccessException e) {
                        Log.d(LOG_TAG, "Error in session capturing: " + e.getMessage(), e.fillInStackTrace());
                    }
                }

                @Override
                public void onConfigureFailed(CameraCaptureSession session) {
                    Log.d(LOG_TAG, "Error in configuring session : ");
                }
            };

            //Creating a capture session for the cameraDevice
            cameraDevice.createCaptureSession(outputSurfaces, sessionStateCallBack, mBackgroundHandler);
        } catch (CameraAccessException e) {
            Log.d(LOG_TAG, "Error in Camera access - (Did you call Open?): " + e.getMessage(), e.fillInStackTrace());
        }
    }

    public void openCamera() {
        try {
            String[] camList = manager.getCameraIdList();
            Log.d(LOG_TAG,"first two Camera available "+camList[0]+" - "+camList[1]);
            this.cameraId = camList[0];
            CameraCharacteristics characteristics = manager.getCameraCharacteristics(cameraId);
//            StreamConfigurationMap map = characteristics.get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);
//            assert map != null;
//            imageDimension = map.getOutputSizes(SurfaceTexture.class)[0];
            // Add permission for camera and let user grant the permission
            if (_context.checkCallingOrSelfPermission(Manifest.permission.CAMERA)!=PackageManager.PERMISSION_GRANTED && _context.checkCallingOrSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)!= PackageManager.PERMISSION_GRANTED) {
                _context.enforceCallingOrSelfPermission(Manifest.permission.CAMERA, "need permission for Camera to work");
                _context.enforceCallingOrSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE, "need permission for External Storage to work");
                Log.d(LOG_TAG, "Returned as there are no permissions granted");
                return;
            }
            Log.d(LOG_TAG,"Have all permissions ");
            manager.openCamera(cameraId, stateCallback, mBackgroundHandler);
            Log.d(LOG_TAG, "camera is open");
        } catch (CameraAccessException e) {
            Log.e(LOG_TAG, "error in openCamera X: "+e.getMessage(), e.fillInStackTrace());
        }

    }

/*    protected void updatePreview() {
        if(null == cameraDevice) {
            Log.e(TAG, "updatePreview error, return");
        }
        captureRequestBuilder.set(CaptureRequest.CONTROL_MODE, CameraMetadata.CONTROL_MODE_AUTO);
        try {
            cameraCaptureSessions.setRepeatingRequest(captureRequestBuilder.build(), null, mBackgroundHandler);
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }
    }*/
    public void closeCamera() {
        if (null != cameraDevice) {
            cameraDevice.close();
            cameraDevice = null;
        }
//        if (null != imageReader) {
//            imageReader.close();
//            imageReader = null;
//        }
    }

    @Override
    protected void finalize() throws Throwable {
        super.finalize();
        stopBackgroundThread();
    }
}
