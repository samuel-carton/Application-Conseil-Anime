package com.example.mario.applicationconseilanime;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.Image;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URL;
import java.util.List;


public class Accueil extends AppCompatActivity implements View.OnClickListener {

    private String TAG = Accueil.class.getSimpleName();
    private String title = "Aucun résultat";
    private String nbEpisode = "";
    private String genres = "";
    private ImageView IVposter;
    private Button BTsearch;
    private EditText ETsearch;
    private TextView TVtitle;
    private TextView TVnbep;
    private TextView TVgenres;

    private String search;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_accueil);

        ETsearch = (EditText) findViewById(R.id.edit_text_search);
        BTsearch = (Button) findViewById(R.id.button_search);
        IVposter =(ImageView) findViewById(R.id.image_view_poster);
        TVtitle = (TextView) findViewById(R.id.text_view_title);
        TVnbep = (TextView) findViewById(R.id.text_view_nbep);
        TVgenres = (TextView) findViewById(R.id.text_view_genres);

        BTsearch.setOnClickListener(this);




       // Intent myIntent = new Intent(this, AffichageAnime.class);
       // startActivity(myIntent);


    }

    public void onClick(View v) {
        search = ETsearch.getText().toString().trim();

        if (!TextUtils.isEmpty(search)){
            new GetContacts().execute(search);
        }
    }


private class GetContacts extends AsyncTask<String, Void, Void> {
    @Override
    protected void onPreExecute() {
        super.onPreExecute();
        Toast.makeText(Accueil.this,"Json Data is downloading",Toast.LENGTH_LONG).show();
    }

    @Override
    protected Void doInBackground(String... arg) {
        HttpHandler sh = new HttpHandler();
        // Making a request to url and getting response
        String url = "https://salty-ocean-70640.herokuapp.com/anime/byTitle/"+arg[0];
        String jsonStr = sh.makeServiceCall(url);

        Log.e(TAG, "Response from url: " + jsonStr);
        if (jsonStr != null) {
            try {
                JSONObject jsonObj = new JSONObject(jsonStr);

                title = jsonObj.getString("title");
                nbEpisode = jsonObj.getString("episodes");

                JSONArray genresJSON = jsonObj.getJSONArray("genres");
                for (int i = 0; i < genresJSON.length() && i < 3 ; i++){
                    genres = genres+genresJSON.getString(i)+", ";
                }
                genres= genres.substring(0,genres.length()-2);

                try {
                    URL urlimg = new URL(jsonObj.getString("picture"));
                    Bitmap bmp = BitmapFactory.decodeStream(urlimg.openConnection().getInputStream());
                    IVposter.setImageBitmap(bmp);
                }
                catch (Exception e){

                }

            } catch (final JSONException e) {
                Log.e(TAG, "Json parsing error: " + e.getMessage());
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(getApplicationContext(),
                                "Json parsing error: " + e.getMessage(),
                                Toast.LENGTH_LONG).show();
                    }
                });

            }

        } else {
            Log.e(TAG, "Couldn't get json from server.");
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(getApplicationContext(),
                            "Couldn't get json from server. Check LogCat for possible errors!",
                            Toast.LENGTH_LONG).show();
                }
            });
        }

        return null;
    }

    @Override
    protected void onPostExecute(Void result) {
        super.onPostExecute(result);
        TVtitle.setText("Titre : "+Accueil.this.title);
        TVnbep.setText("Nombre d'épisode : "+Accueil.this.nbEpisode);
        TVgenres.setText("Genres : "+Accueil.this.genres);
        genres = "";
    }
}}