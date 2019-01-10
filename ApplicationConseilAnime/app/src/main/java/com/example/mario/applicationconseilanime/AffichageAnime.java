package com.example.mario.applicationconseilanime;

import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

public class AffichageAnime extends AppCompatActivity {

    private TextView nbEpisodeTW;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_affichage_anime);

        nbEpisodeTW = (TextView) findViewById(R.id.textView4);

        new GetAnimeInfo().execute("episodes");
    }



    private class GetAnimeInfo extends AsyncTask<String, Void, String[]> {
        String[] resultats;
        @Override
        protected void onPreExecute() {
            super.onPreExecute();
        }

        @Override
        protected String[] doInBackground(String...strings) {
            HttpHandler sh = new HttpHandler();
            // Making a request to url and getting response
            String url = "https://salty-ocean-70640.herokuapp.com/anime/byTitle/steins;gate";
            String jsonStr = sh.makeServiceCall(url);

            if (jsonStr != null && strings != null) {
                for(int i = 0; i < strings.length; i++) {
                    try {
                        JSONObject jsonObj = new JSONObject(jsonStr);

                        resultats[i] = jsonObj.getString(strings[i]);


                    } catch (final JSONException e) {

                    }
                }

            } else {

            }

            return resultats;
        }

        @Override
        protected void onPostExecute(String[] resultats) {
            super.onPostExecute(resultats);
            if (resultats != null) {
            for(int i = 0; i < resultats.length; i++) {
                nbEpisodeTW.setText(resultats[i]);
            }
        }
    }
}
}
