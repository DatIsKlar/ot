var options = ["Double tap","Hide shots","Force safe point","Force body aim"];//Options should be named like the corresponding ui name
UI.AddMultiDropdown( ["Rage", "Exploits","General"],"Stuff",options);

var offset = -50;
for(i =0; i< options.length;i++){
    UI.AddColorPicker( ["Rage", "Exploits","General"], options[i] );//creatd i amounts of Color pickers depending on the amount of options
}
   
value = UI.GetValue;
function Test() {
   
    var font = Render.AddFont("Verdana", 11, 600);
    var List = [];
    var mulit = value(["Rage", "Exploits","General","Stuff"]);

    var check = [//array with values for checkboxes/keybind for indicator options
    value(["Rage", "Exploits", "Key assignment", options[0]]),
    value(["Rage", "Exploits", "Key assignment", options[1]]),
    value(["Rage", "General", "General", "Key assignment", options[2]]),
    value(["Rage", "General", "General", "Key assignment", options[3]])
    ]
   
    for(i =0; i < options.length;i++){
        if(mulit&(1<<i)){//checks if muilty select option is active option are equall to 1<<pos in the mulity select
            UI.SetEnabled( ["Rage", "Exploits","General",options[i]], 1 );
            if(check[i])//checks if key/checkbox is active
                List.push([options[i],UI.GetColor(["Rage", "Exploits","General", options[i]])]);//if actives pushes option name and color into a 2d array
        }else
            UI.SetEnabled( ["Rage", "Exploits","General",options[i]], 0 );
    }
   
    var screen_size = Render.GetScreenSize();
    drawpoint = 75;
    if (List.length > 0) {
        for (i = 0; i < List.length; i++) {//this should be self explaining.
            Render.String(screen_size[0] / 2, screen_size[1] / 2 + drawpoint, 1, List[i][0],List[i][1], font);
            drawpoint = drawpoint + 15;
        }
    }
}
Cheat.RegisterCallback("Draw", "Test");
