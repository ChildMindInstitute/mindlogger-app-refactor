package lab.childmindinstitute.data.image_conversion;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.media.ExifInterface;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class ImageConversionModule extends ReactContextBaseJavaModule {

    public ImageConversionModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ImageConversionModule";
    }

    @ReactMethod
    public void convertHeicToJpg(String heicFilePath, Promise promise) {
        try {
            File heicFile = new File(heicFilePath);

            File cacheDir = getReactApplicationContext().getCacheDir();

            String jpgFileName = heicFile.getName().replace(".heic", ".jpg");
            File jpgFile = new File(cacheDir, jpgFileName);
            String jpgFilePath = jpgFile.getAbsolutePath();

            BitmapFactory.Options options = new BitmapFactory.Options();
            Bitmap bitmap = BitmapFactory.decodeFile(heicFile.getAbsolutePath(), options);

            if (bitmap == null) {
                promise.reject("DECODE_ERROR", "Failed to decode HEIC file into Bitmap");
                return;
            }

            int orientation = getOrientation(heicFilePath);
            if (orientation != 0) {
                Matrix matrix = new Matrix();
                matrix.postRotate(orientation);
                bitmap = Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), matrix, true);
            }

            FileOutputStream outputStream = new FileOutputStream(jpgFile);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream);
            outputStream.flush();
            outputStream.close();

            promise.resolve(jpgFilePath);
        } catch (IOException e) {
            promise.reject("CONVERSION_ERROR", e.getMessage());
        }
    }

    private int getOrientation(String filePath) {
        try {
            ExifInterface exifInterface = new ExifInterface(filePath);
            int orientation = exifInterface.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);
            switch (orientation) {
                case ExifInterface.ORIENTATION_ROTATE_90:
                    return 90;
                case ExifInterface.ORIENTATION_ROTATE_180:
                    return 180;
                case ExifInterface.ORIENTATION_ROTATE_270:
                    return 270;
                default:
                    return 0;
            }
        } catch (IOException e) {
            e.printStackTrace();
            return 0;
        }
    }
}
