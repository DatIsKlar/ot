// JavaScript source code

UI.AddHotkey( ["Rage","General","General","Key assignment"], "Chicken Aimbot", "Chicken Aimbot");
UI.AddSliderInt(["Rage","General","General"],"Chicken Aimbot Fov", 0, 180);
UI.AddCheckbox(["Rage","General","General"],"Chicken Aimbot Silent");

const IN_JUMP = (1 << 1);
const IN_ATTACK = (1 << 0); //https://github.com/ValveSoftware/source-sdk-2013/blob/master/mp/src/game/shared/in_buttons.h#L30
const IN_ATTACK2 = (1 << 11);

//feel free to take any function you like from this script, also tried my best to comment on the import parts
//pls note that english is not my first language

//subtraction of two vectors
function subtract(a,b){
    x = a[0] - b[0];
    y = a[1] - b[1];
    z = a[2] - b[2];
    var vec = [x,y,z];
    return(vec)
}

//addition of two vectors
function addition(a,b){ 
    x = a[0] + b[0];
    y = a[1] + b[1];
    z = a[2] + b[2];
    var vec = [x,y,z];
    return(vec)
}

//distance between two vectors
function distance(a,b){
    var vec = subtract(b,a);
    x = vec[0];
    y = vec[1];
    z = vec[2];
    return Math.sqrt( x * x + y * y + z * z );
}

//gets length of a forward vector
function length(a){
    x = a[0];
    y = a[1];
    z = a[2];
    return Math.sqrt( x * x + y * y + z * z );
}

//multiplication of two vectors
function multiply_vector(a,b){
    var vec;
    x = a[0]*b[0];
    y = a[1]*b[1];
    z = a[2]*b[2];
    vec = [x,y,z];
    return vec;
}

//multiplication of a vector with an float
function multiply_vector_float(a,b){
    var vec;
    x = a[0]*b;
    y = a[1]*b;
    z = a[2]*b;
    vec = [x,y,z];
    return vec;
}

//converts degrees to radians
function DEG2RAD(deg){
    return deg*(Math.PI/180);
}

//angle to an forward vector
function AngleVectors(angle)
{   
    var forward;
	x = Math.cos(DEG2RAD(angle[0]))*Math.cos(DEG2RAD(angle[2]));
	y = Math.cos(DEG2RAD(angle[0]))*Math.sin(DEG2RAD(angle[2]));;
	z = -Math.sin(DEG2RAD(angle[0]));
    forward = [x,y,z];
    return forward;
}

//normalized the viewangle
function NormalizeAngles(angle)
{
	while (angle[0] > 89.00)
		angle[0] -= 180.00;

	while (angle[0] < -89.00)
		angle[0] += 180.00;

	while (angle[1] > 180.00)
		angle[1] -= 360.00;

	while (angle[1] < -180.00)
		angle[1] += 360.00;

    return angle;
}

//calculates fov
function GetFov(viewAngle, aimAngle)
{
	var delta = subtract(aimAngle,viewAngle);
	delta = NormalizeAngles(delta);
	return Math.sqrt(Math.pow(delta[0], 2.00) + Math.pow(delta[1], 2.00));
}

//straight pasted from source sdk https://github.com/ValveSoftware/source-sdk-2013/blob/master/sp/src/mathlib/mathlib_base.cpp#L535
//gets the euler angles from an forward vector
function VectorAngles(forward)
{
	var angles;
	var	tmp, yaw, pitch;
	
	if (forward[1] == 0 && forward[0] == 0)
	{
		yaw = 0;
		if (forward[2] > 0)
			pitch = 270;
		else
			pitch = 90;
	}
	else
	{
		yaw = (Math.atan2(forward[1], forward[0]) * 180 / Math.PI);
		if (yaw < 0)
			yaw += 360;

		tmp = Math.sqrt (forward[0]*forward[0] + forward[1]*forward[1]);
		pitch = (Math.atan2(-forward[2], tmp) * 180 / Math.PI);
		if (pitch < 0)
			pitch += 360;
	}
	
	x = pitch;
	y = yaw;
	z = 0;
    angles = [x,y,z];
    
	return angles;
}

function int_boolean(a){
    if(a == 1){
        return true;
    }else{
        return false;
    }
}
//copyed from https://www.onetap.com/threads/release-updated-force-conditions-force-head-force-body-force-safety.31586/
function extrapolate_tick(entity, ticks, Eye){
    velocity = Entity.GetProp(entity, "CBasePlayer", "m_vecVelocity[0]");
    new_pos = addition(Eye,multiply_vector_float(velocity,Globals.TickInterval()*ticks));
    return new_pos;
}

//removes recoil of gun 
function no_recoil(viewangles,Player){  
    var weapon_recoil_scale = Convar.GetFloat("weapon_recoil_scale");// get server recoil scale

    if(weapon_recoil_scale == null){
        weapon_recoil_scale = 2.00;
    }
    var punch = Entity.GetProp(Player,"DT_CSPlayer","m_aimPunchAngle");
    var new_angle = subtract(viewangles,multiply_vector_float(punch,weapon_recoil_scale));//subtract punch from viewangle
    return new_angle;
}  
//tries to negate movement
function auto_stop(Player,UserCmd){
    var vel  = Entity.GetProp(Player, "CBasePlayer", "m_vecVelocity[0]");
    var direction = VectorAngles(vel);
    var speed = length(vel);
    direction[1] = Local.GetRealYaw()-direction[1];
    var negate = AngleVectors(direction)*(-speed);
    var movement = UserCMD.GetMovement();
    forwardmove = movement[0]*0.15+negate[0];
    sidemove = movement[1]*0.15+negate[1];
    up = movement[2];
    UserCMD.SetMovement([forwardmove,sidemove,up]);
}

var scoped  = false;
var sec_ticks =0;
//tries to autoscope
function auto_scope(Player, UserCMD, ticks){
    var scope = Entity.GetProp(Player,"DT_CSPlayer","m_bIsScoped");
    var index = Entity.GetWeapon(Player)
    var classid = Entity.GetClassID(index);
    if(classid == 260 ||classid == 261 || classid == 241 || classid ==232 ){
        if(scope == 0){
            UserCMD.SetButtons(UserCMD.GetButtons | IN_ATTACK2);
            sec_ticks = ticks+1;
        }
    }
    if(sec_ticks >= ticks){
        sec_ticks == 0;
        scoped = false;
    }else{
        scoped = true;
    }
    return scoped;
}


//gets chicken origin
function chicken_abs(chicken){
    return Entity.GetProp(chicken, "DT_CChicken", "m_vecOrigin");
}

//gets closed chickend to local player
function get_closed(CChicken,Eye,Player){
    var max = 9999;
    var closet = null;
    var new_pos = extrapolate_tick(Player,5,Eye);
    for(i =0;i< CChicken.length; i++){
        var Body = chicken_abs(CChicken[i]);
        var result = Trace.Line(Player, new_pos, Body);//checks if the chicken is visable
        if(result[1]>0.9){
            var dis = distance(new_pos,Body);
            if(dis < max){
                max = dis;
                closet = CChicken[i];
            }
        } 
    } 
    return closet;
}

//checks if you can shoot at the chicken
function can_shoot(Player){
    var index = Entity.GetWeapon(Player)
    var classid = Entity.GetClassID(index);
    
    var weapon =  classid == 107 || classid == 108 || classid == 96 || classid == 99 || classid ==112 || classid == 155 || classid == 47 || classid == 267;//checking if the selected weapon is knife or nade
    var clip = Entity.GetProp(index, "DT_BaseCombatWeapon", "m_iClip1");
    
    if(weapon || clip == 0 || UserCMD.GetButtons & IN_JUMP)//check if player is jumping or as an empty mag
        return false;

    return true;
}

//main function
var ticks =0;
function onCreateMove()
{
    ticks++;
    if(!UI.GetValue(["Rage","General","General","Key assignment", "Chicken Aimbot"]))
        return;

    var max_fov = UI.GetValue(["Rage","General","General","Chicken Aimbot Fov"]);

    if(max_fov == 0)
        return;

    var Player = Entity.GetLocalPlayer();//get local player index
    var Eye = Entity.GetEyePosition(Player);//get player shot position
    if(!Player)
        return;
    var CChicken = Entity.GetEntitiesByClassID( 36 );//gets all chickens as an array

    if(CChicken == null)//checks if there is no chickens
        return;

    var closet = get_closed(CChicken,Eye,Player);//get the chicken closet to you that is also visable
    can_shoot(Player);
    
    if(closet == null)//checks if there is a closet chicken
        return;
    var abs = chicken_abs(closet);
    abs[2] +=6;   

    
    if(!can_shoot(Player))//checks if you can shoot at the chicken
        return;
   
    if(!auto_scope(Player,UserCMD,ticks))//checks if scoped
        return;

    auto_stop(Player,UserCMD);
    
    var result = Trace.Line(Player, Eye, abs);//checks if the chicken is visable
    if(result[1]<= 0.9)
        return;

    var viewangle = VectorAngles(subtract(abs,Eye));//calculates the euler anlges of the forward vectors between local player and closet chicken
    var Fov = GetFov(Local.GetViewAngles(),viewangle);
    if(max_fov<Fov)
        return;

    var weapon_index = Entity.GetWeapon(Player);  
    var m_flNextPrimaryAttack = Entity.GetProp(weapon_index,"DT_BaseCombatWeapon","m_flNextPrimaryAttack")//gets time until next attack
    var corrected_angles = viewangle;
    if(!UI.GetValue(["Rage","General","General","Enabled"])){
         corrected_angles = no_recoil(viewangle,Player);//compensates for recoil
    }
    
    corrected_angles =  NormalizeAngles(corrected_angles);
    if(m_flNextPrimaryAttack < Globals.Curtime()){//checks if next attack time is < server time if yes you can execute a shot
        UserCMD.SetViewAngles(corrected_angles,int_boolean(UI.GetValue(["Rage","General","General", "Chicken Aimbot Silent"])));//sets viewangle to the chicken
        UserCMD.SetButtons(IN_ATTACK | UserCMD.GetButtons);//fires shot after viewangles have been set
        //wanted to do an trace line to check if I actually aim at the chicken sadly for some reason I cant get the chicken returned as entity
    }
}
Cheat.RegisterCallback("CreateMove", "onCreateMove");