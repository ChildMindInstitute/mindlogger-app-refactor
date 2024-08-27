package lab.childmindinstitute.data.image_dimensions;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.io.File;

public class ImageDimensionsModule extends ReactContextBaseJavaModule {

    public ImageDimensionsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ImageDimensions";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public WritableMap getImageDimensionsSync(String uri) {
      File imageFile = new File(uri);
      
      if (imageFile.exists()) {
        Bitmap bitmap = BitmapFactory.decodeFile(imageFile.getAbsolutePath());
          
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();

        WritableMap map = Arguments.createMap();
        
        map.putInt("width", width);
        map.putInt("height", height);

        return map;
      } else {
        return null;
      }
    }
}
