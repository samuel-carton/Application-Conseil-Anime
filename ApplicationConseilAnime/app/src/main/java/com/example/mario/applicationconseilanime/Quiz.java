package com.example.mario.applicationconseilanime;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ViewFlipper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedOutputStream;
import java.io.BufferedWriter;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

public class Quiz extends AppCompatActivity {
    private int shonen = 0;
    private int shojo = 0;
    private int seinen = 0;
    private int josei = 0;
    private EditText age;
    private EditText email;
    private EditText password;
    private EditText passwordV;
    private EditText ageET;
    private String emailS = "login";
    private String motdepasse = "motdepasse";



    private String TAG = Quiz.class.getSimpleName();

    public void checkInputAge(){
        age = findViewById(R.id.selectage);
        int ageint = Integer.parseInt(age.getText().toString());
        if (ageint>18){
            seinen = seinen + 1;
            josei = josei + 1;
        }
        else {
            shojo = shojo + 1;
            shonen = shonen + 1;
        }
    }





    //TODO : ajouter la gestion de l'adresse mail et du mot de passe
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_quiz);
        final ViewFlipper viewFlipper = findViewById(R.id.quizflipper);

        final EditText emailET = (EditText) findViewById(R.id.usermail);
        final EditText passET = (EditText) findViewById(R.id.pswd);
        final EditText passvET = (EditText) findViewById(R.id.pswdconf);
        final EditText ageET = (EditText)findViewById(R.id.selectage);

        final CheckBox homme = findViewById(R.id.homme);
        homme.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {

                                               @Override
                                               public void onCheckedChanged(CompoundButton buttonView,boolean isChecked) {
                                                   if(homme.isChecked()) {
                                                       seinen = seinen + 1;
                                                       shonen = shonen + 1;
                                                   }
                                                   else {
                                                       seinen = seinen - 1;
                                                       shonen = shonen - 1;
                                                   }
                                               }
                                           }

        );

        final CheckBox femme = findViewById(R.id.femme);
        femme.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {

                                             @Override
                                             public void onCheckedChanged(CompoundButton buttonView,boolean isChecked) {
                                                 if(femme.isChecked()) {
                                                     shojo = shojo + 1;
                                                     josei = josei + 1;
                                                 }
                                                 else {
                                                     shojo = shojo - 1;
                                                     josei = josei - 1;
                                                 }
                                             }
                                         }

        );

        final CheckBox naruto = findViewById(R.id.naruto);
        naruto.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {

                                             @Override
                                             public void onCheckedChanged(CompoundButton buttonView,boolean isChecked) {
                                                 if(naruto.isChecked()) {
                                                     shonen = shonen + 1;
                                                 }
                                                 else {
                                                     shonen = shonen - 1;
                                                 }
                                             }
                                         }

        );

        final CheckBox sailormoon = findViewById(R.id.onepiece);
        sailormoon.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {

                                             @Override
                                             public void onCheckedChanged(CompoundButton buttonView,boolean isChecked) {
                                                 if(sailormoon.isChecked()) {
                                                     shojo = shojo + 1;
                                                 }
                                                 else {
                                                     shojo = shojo - 1;
                                                 }
                                             }
                                         }

        );

        final CheckBox berserk = findViewById(R.id.fairytail);
        berserk.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {

                                                  @Override
                                                  public void onCheckedChanged(CompoundButton buttonView,boolean isChecked) {
                                                      if(berserk.isChecked()) {
                                                          seinen = seinen + 1;
                                                      }
                                                      else {
                                                          seinen = seinen - 1;
                                                      }
                                                  }
                                              }

        );

        final CheckBox princessj = findViewById(R.id.bleach);
        princessj.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {

                                               @Override
                                               public void onCheckedChanged(CompoundButton buttonView,boolean isChecked) {
                                                   if(princessj.isChecked()) {
                                                       josei = josei + 1;
                                                   }
                                                   else {
                                                       josei = josei - 1;
                                                   }
                                               }
                                           }

        );

        final CheckBox dbz = findViewById(R.id.dbz);
        dbz.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {

                                              @Override
                                              public void onCheckedChanged(CompoundButton buttonView,boolean isChecked) {
                                                  if(dbz.isChecked()) {
                                                      shonen = shonen + 1;
                                                  }
                                                  else {
                                                      shonen = shonen - 1;
                                                  }
                                              }
                                          }

        );


        final Button suivantmail = findViewById(R.id.nextmail);
        suivantmail.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    viewFlipper.setDisplayedChild(1);
                }


    });

        final Button suivantmdp = findViewById(R.id.nextpswd);
        suivantmdp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                viewFlipper.setDisplayedChild(2);
            }


        });

        final Button suivantsexe = findViewById(R.id.nextsexe);
        suivantsexe.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                viewFlipper.setDisplayedChild(3);
            }


        });

        final Button suivantage = findViewById(R.id.nextage);
        suivantage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String ageS = ageET.getText().toString().trim();
                if(!TextUtils.isEmpty(ageS)){
                    checkInputAge();
                }
                viewFlipper.setDisplayedChild(4);
            }


        });


        final Button suivantshonen = findViewById(R.id.nextshonen);
        suivantshonen.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(shonen>9){shonen=9;}
                if(seinen>9){seinen=9;}
                if(shojo>9){shojo=9;}
                if(josei>9){josei=9;}
                if(!TextUtils.isEmpty(emailET.getText().toString().trim())){emailS = emailET.getText().toString();}
                if(passET.getText().toString() == passvET.getText().toString()){motdepasse = passET.getText().toString();}
                new GetContacts().execute(emailS,motdepasse, Integer.toString(shonen),Integer.toString(shojo),Integer.toString(seinen),Integer.toString(josei));


                Intent myIntent = new Intent(Quiz.this, Start.class);
                myIntent.putExtra("key", "hi"); //Optional parameters
                Quiz.this.startActivity(myIntent);
            }


        });





    }

    private class GetContacts extends AsyncTask<String, Void, Void> {
        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            Toast.makeText(Quiz.this,"Uploading data",Toast.LENGTH_LONG).show();
        }

        @Override
        protected Void doInBackground(String... arg) {
            HttpHandler sh = new HttpHandler();
            // Making a request to url and getting response
            String url = "https://salty-ocean-70640.herokuapp.com/auth/"+arg[0]+"/"+arg[1]+"/"+arg[2]+arg[3]+arg[4]+arg[5];
            String jsonStr = sh.makeServiceCall(url);

            Log.e(TAG, "Response from url: " + jsonStr);
            if (jsonStr != null) {


            } else {

            }

            return null;
        }

        @Override
        protected void onPostExecute(Void result) {
            super.onPostExecute(result);

        }
    }}

