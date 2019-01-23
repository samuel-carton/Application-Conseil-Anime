package com.example.mario.applicationconseilanime;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;

import java.util.Stack;

/**
 * Created by ${SamuelCarton} on 23/01/2019.
 */
public class Start extends AppCompatActivity{

    private Button btn_search;
    private Button btn_quiz;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_start);

        btn_search = (Button) findViewById(R.id.button_search);
        btn_quiz = (Button) findViewById(R.id.button_quiz);


        btn_quiz.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent myIntent = new Intent(Start.this, Quiz.class);
                myIntent.putExtra("key", "hi"); //Optional parameters
                Start.this.startActivity(myIntent);
            }
        });

        btn_search.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent myIntent = new Intent(Start.this, Accueil.class);
                myIntent.putExtra("key", "hi"); //Optional parameters
                Start.this.startActivity(myIntent);
            }
        });
    }
    
    
}
