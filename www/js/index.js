/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        var apigee = new Apigee.Client({
            orgName:'mdobson',
            appName:'sandbox'
        });

        // A Collection object that will be used to hold the list of books locally
        var my_landmarks = null;

        function loadLandmarks(location){
          // Actual network call

            my_landmarks = new Apigee.Collection({ "client":apigee, "type":"landmarks", "qs":{"ql":"location within 15000 of "+location.coords.latitude+","+location.coords.longitude}});
            my_landmarks.fetch(

                // Success Callback
                function () {
                    $('#landmarks-list').empty();
                    
                    while ( my_landmarks.hasNextEntity() ) {
                        var current_landmark = my_landmarks.getNextEntity();

                        // Output the book on the page
                        $('#landmarks-list').append('<li><h3>'+current_landmark.get('landmark_name')+'</h3><p>'+current_landmark.get('city')+'</p></li>');
                    }
                    
                    // Re-apply jQuery Mobile styles
                    $('#landmarks-list').listview('refresh');
                },

                // Failure Callback
                function () { alert("read failed"); }
            );
        }

        function createLandmark(){
          new_landmark = { "landmark_name":$("#name-field").val(),
                        "city":$("#location-field").val() };

            my_landmarks.addEntity(new_landmark, function (error, response) {
                if (error) {
                    alert('write failed');
                } else {
                    $("#name-field").val(""), $("#location-field").val("");
                    loadLandmarks();
                    history.back();
                }
            });
        }
        $("#create-button").bind("click", createLandmark);
        navigator.geolocation.getCurrentPosition(loadLandmarks);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
