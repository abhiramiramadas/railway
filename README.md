Rail Gate Predictor — My LC Edition
========================================

A tiny web app that tells you if the railway gate is about to ruin your day.

What this thing does
--------------------

*   Predicts when the gate closes, so you don’t have to sprint like you're auditioning for a sports commercial.
    
*   Uses “live train data,” which is essentially trains oversharing their location in real time.
    
*   If the prediction is wrong, please argue with the train, not the code.
    
*   Debugged using equal parts logic and emotional instability.
    
*   Designed specifically for the level crossing my dad goes thru because that gate behaves like it has unresolved trauma.
    

Additional Reason — Sun Tan Avoidance Edition
---------------------------------------------

I also built this because my dad is tired of standing at the railway crossing and getting sun-tanned like he’s being slow-roasted by the Thiruvananthapuram sun.If the gate is closed, he can wait indoors, in shade, like a civilized human being.Skincare triumphs over unnecessary suffering.

The Real Reason This Exists
---------------------------

Official story: I built this so my dad can reach office without unexpected railway gate delays.

Real story:He never leaves on time anyway, so society benefits more from this project than he does.

Actual, genuine reason:He’s tired of getting sun-tanned at the Melanootr crossing like a papadam forgotten on the tawa.This app reduces UV exposure by approximately 100%, assuming you follow the single instruction:“Do not go outside when it says CLOSED.”

Features
--------

*   Global gate banner — large, honest, and not afraid to hurt your feelings.
    
*   Countdown timers — for anyone who appreciates knowing exactly when their hopes will be crushed.
    
*   Kerala-style timing logic — realistic for Thiruvananthapuram suburban traffic speeds.
    
*   Leaflet map — dots on a map, but useful.
    
*   Trains sorted by distance — closest one gets the privilege of ruining your schedule.
    
*   Local proxy — because RailRadar decided CORS was optional.
    

Crossing Location
-----------------

Finally corrected after Google Maps betrayed us multiple times.
8.4855164921516, 76.9628715202519
( Level Crossing)


Tech Stack
----------

*   HTML — the structure
    
*   CSS — the attempt at looking respectable
    
*   JavaScript — the source of both solutions and problems
    
*   Node + Express proxy — because browsers refused to cooperate
    
*   RailRadar API — works most of the time, in theory
    

How to Run
----------

```bash
npm install
node proxy.js
```
Then open index.html in a browser(or use VS Code Live Server if you prefer convenience).

Project Structure
-----------------

## Project Structure

```
folder/
 ├── index.html      # frontend UI
 ├── script.js       # logic + gate status + map
 ├── style.css       # design inspired by government websites
 ├── proxy.js        # backend proxy server
 └── README.md       # this document
```


Notes
-----

* gate logic is based on maths + vibes
    
*  Trains sometimes teleport (railradar lore)
    
*   if the gate opens early, that’s a miracle not a bug
    
*   if it stays closed for 17 minutes straight… welcome to Kerala 🚧
    
💛Disclaimer
----------
this is ✨not✨ official railway data
pls don’t shout at RPF officers saying
“ai said gate will open in 6 minutes!!!!!”

i will deny everything. 😌



