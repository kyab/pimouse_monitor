var ros = new ROSLIB.Ros(
    {url : "ws://" + location.hostname + ":9000"
});

ros.on("connection", function(){console.log("websocket: connected");});
ros.on("error", function(error){console.log("websocket error: ", error);});
ros.on("close", function(){console.log("websocket: closed");});

var ls = new ROSLIB.Topic({
    ros: ros,
    name: "/lightsensors",
    messageType : "/pimouse_ros/LightSensorValues"

});

ls.subscribe(function(message){
    for(e in message){
        document.getElementById(e).innerHTML = message[e];
    }
});

document.getElementById("camstream").data = "http://"
    + location.hostname
    + ":10000/stream?topic=/cv_camera_node/image_raw";


var on = new ROSLIB.Service({
    ros:ros,
    name : "/motor_on",
    messageType:"std_srvs/Trigger"
});

var on = new ROSLIB.Service({
    ros:ros,
    name : "/motor_on",
    messageType:"std_srvs/Trigger"
});

var off = new ROSLIB.Service({
    ros:ros,
    name : "/motor_off",
    messageType:"std_srvs/Trigger"
});

$("#motor_on").on("click", function(e){
    on.callService(ROSLIB.ServiceRequest(), function(result){
        if(result.success){
            $("#motor_on").attr("class", "btn btn-danger");
            $("#motor_off").attr("class", "btn btn-default");
        }
    });
});

$("#motor_off").on("click", function (e) {
    off.callService(ROSLIB.ServiceRequest(), function (result) {
        if (result.success) {
            $("#motor_on").attr("class", "btn btn-default");
            $("#motor_off").attr("class", "btn btn-primary");
        }
    });
});

var vel = new ROSLIB.Topic({
    ros:ros,
    name:"/cmd_vel",
    messageType : "geometry_msgs/Twist"
});

function pubMotorValues(){
    fw = $("#vel_fw").html();
    rot = $("#vel_rot").html();

    fw = parseInt(fw)*0.001*0.1;
    rot = 3.141592 * parseInt(rot)/180;
    v = new ROSLIB.Message({
        linear:{x:fw, y:0, z:0},
        angular:{x:0, y:0, z:rot}
    });
    vel.publish(v);
}

$("#touchmotion").on("click", function(e){
    rect = $("#touchmotion")[0].getBoundingClientRect();
    x = e.pageX - rect.left - window.pageXOffset;
    y = e.pageY - rect.top - window.pageYOffset;

    vel_fw = (rect.height/2 - y)*3;
    vel_rot = rect.width/2 - x;

    $("#vel_fw").html(parseInt(vel_fw));
    $("#vel_rot").html(parseInt(vel_rot));
});

setInterval(pubMotorValues,1000);