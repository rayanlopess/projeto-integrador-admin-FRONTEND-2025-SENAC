package io.ionic.starter;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle; // <-- LINHA QUE FALTAVA

public class MainActivity extends BridgeActivity {
@Override
public void onCreate(Bundle savedInstanceState) {
super.onCreate(savedInstanceState);
getWindow().getDecorView().setBackgroundColor(0); 
}
}