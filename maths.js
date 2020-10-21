// JavaScript source code
/* math.js */

//subtracts two vectors a-b
function VectorSubtract(a,b){
    x = a[0] - b[0];
    y = a[1] - b[1];
    z = a[2] - b[2];
    var vec = [x,y,z];
    return(vec)
}
//addition of two vectors a+b
function VectorAdd(a,b){ 
    x = a[0] + b[0];
    y = a[1] + b[1];
    z = a[2] + b[2];
    var vec = [x,y,z];
    return(vec)
}
//multiplication of two vectors a*b
function VectorMultiply(a,b){
    x = a[0]*b[0];
    y = a[1]*b[1];
    z = a[2]*b[2];
    var vec = [x,y,z];
    return vec;
}

//devides two vector a/b
function VectorDivide(a,b){
    x = a[0]/b[0];
    y = a[1]/b[1];
    z = a[2]/b[2];
    var vec = [x,y,z];
    return vec;
}

//multiplication of a vector with an number(scalar)
function VectorMultiplyScalar(a,b){
    x = a[0]*b;
    y = a[1]*b;
    z = a[2]*b;
    var vec = [x,y,z];
    return vec;
}

//get the scalar(number) of two Vectors 
function Dot(a,b){
   var vec = VectorMultiply(a,b);
   return vec[0]+vec[1]+vec[2];
}

//gets length of an forward vector
function Length(forward){
    x = forward[0];
    y = forward[1];
    z = forward[2];
    return Math.sqrt( x * x + y * y + z * z );
}
//get the scalar(number) of an forward vector
function Length2d_Sqr(forward){
    return(forward[0]*forward[0]+forward[1]*forward[1]+forward[2]*forward[2]);
}

//distance between two points 
function Distance(a,b){
    var vec = VectorSubtract(a,b);
    return Length(vec);
}

//converts degrees to radians
function DEG2RAD(deg){
    return deg*(Math.PI/180);
}
//converts radians to degrees
function RAD2DEG(rad){
    return rad*(180/Math.PI);
}

//produces an vector which is orthogonal(right angle) both vectors
function Cross(a,b){
    x = a[1]*b[2] - a[2]*b[1];
	y = a[2]*b[0] - a[0]*b[2];
	z = a[0]*b[1] - a[1]*b[0];
}

//get and forward vector from an angle like viewangles
function AngleVectors(angle)
{   
	x = Math.cos(DEG2RAD(angle[0]))*Math.cos(DEG2RAD(angle[2]));
	y = Math.cos(DEG2RAD(angle[0]))*Math.sin(DEG2RAD(angle[2]));;
	z = -Math.sin(DEG2RAD(angle[0]));
    var forward = [x,y,z];
    return forward;
}
//normalized and then returns the viewangle
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
//calculates the fov between two angles
function GetFov(viewangle, aimangle)
{
	var delta = VectorSubtract(viewangle,aimangle);
	delta = NormalizeAngles(delta);
	return Math.sqrt(Math.pow(delta[0], 2.00) + Math.pow(delta[1], 2.00));
}
//straight pasted from source sdk https://github.com/ValveSoftware/source-sdk-2013/blob/master/sp/src/mathlib/mathlib_base.cpp#L535
//gets the euler angles from an forward vector
function VectorAngles(forward)
{
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
    var angles = [x,y,z];
    
	return angles;
}

exports.VectorSubtract = VectorSubtract;
exports.VectorAdd = VectorAdd;
exports.VectorMultiply = VectorMultiply;
exports.VectorDivide = VectorDivide;
exports.VectorMultiplyScalar = VectorMultiplyScalar;
exports.Dot = Dot;
exports.Length = Length;
exports.Length2d_Sqr = Length2d_Sqr;
exports.Distance = Distance;
exports.DEG2RAD = DEG2RAD;
exports.RAD2DEG = RAD2DEG;
exports.Cross = Cross;
exports.AngleVectors = AngleVectors;
exports.NormalizeAngles = NormalizeAngles;
exports.GetFov = GetFov;
exports.VectorAngles = VectorAngles;
