let three, controls, objects, knotParams;

let pointCoords = [0,0,0];

let presentation = null;

let manifoldPoint = null;//will be an EXP.Transformation

let settings = {'updateControls':true};

let xAxis, yAxis, zAxis, wAxis = null;
let xAxisControl,yAxisControl,zAxisControl = null; //the 3 3D axes
let manifoldPointOutput = null; //the 3 points on the R^3 = three Rs graph
let manifoldPointPositions = null // the positions of those points

let manifold4PointOutput = null;

function pointPath(i,t,x){
    //point in 3D space's path
    return [Math.sin(t/3), Math.sin(t/5), Math.sin(t/7), Math.sin(t/2.5)]
}

function setup(){
	three = EXP.setupThree(60,15,document.getElementById("canvas"));
	controls = new THREE.OrbitControls(three.camera,three.renderer.domElement);
    

	three.camera.position.z = 3;
	three.camera.position.y = 0.5;

    controls.autoRotate = true;    
    controls.enableKeys = false;
    controls.autoRotateSpeed = 1;
    
	three.on("update",function(time){
		for(var x of objects){
			x.activate(time.t);
		}

        //HACKY HACK ALERT. If I don't disable the controls, then when I try to lerp the camera position they both fight for domination over camera rotation, making a jerky ride.
		if(settings.updateControls){

            controls.update();
        }
	});

    console.log("Loaded.");

    var a=1;
    var b=2;
    let domainWidth = 2*Math.PI; //width of the area in R^2 that's being passed into this parametrization.

    function manifoldEmbeddingIntoR3(i,t,theta1,theta2){
        if(userPointParams.factors[0] == 'circle'){

            if(userPointParams.factors[1] == 'circle'){
                return [(a*Math.cos(theta1)+b)*Math.cos(theta2),(a*Math.cos(theta1)+b)*Math.sin(theta2),a*Math.sin(theta1)];
            }else{
                return [b*Math.sin(theta1),theta2/1.5,b*Math.cos(theta1)];
            }

        }else{

            if(userPointParams.factors[1] == 'circle'){
                return [b*Math.sin(theta2),theta1/1.5,b*Math.cos(theta2)];
            }else{
                //plane
                return [theta2, theta1, 0];
            }


        }
    }


    var torus = new EXP.Area({bounds: [[-domainWidth/2,domainWidth/2],[-domainWidth/2, domainWidth/2]], numItems: [30,30]});
    /*var manifoldParametrization = new EXP.Transformation({'expr': (i,t,theta1,theta2) => manifoldEmbeddingIntoR3(i,t,theta1,theta2)
    });
    var output = new EXP.SurfaceOutput({opacity:0.3, color: blue, showGrid: true, gridLineWidth: 0.05, showSolid:true});

    torus.add(manifoldParametrization).add(output);*/

    let axisSize = 1.5;


    
    var threeDPoint = new EXP.Array({data: [[0]]})
    manifoldPoint = new EXP.Transformation({expr: (i,t,x) => pointPath(i,t,x)});

    //threeDPoint's visual job is now taken by multipleManifoldPoints - multiple points which overlap, then separate.
    // it's not needed to be displayed anymore. It still needs to exist to update the DOM though.
    threeDPoint
    .add(manifoldPoint)
    //.add(new EXP.PointOutput({width:0.2, color: pointColor}));
    


    var multipleManifoldPoints = new EXP.Array({data: [[0],[1],[2]]});
    /*
    manifoldPointPositions = new EXP.Transformation({expr: (i,t,x) => {
        let point3DPos = pointPath(i,t,x); 
        let returnedPos = [point3DPos[i],i-1,0];
        return returnedPos;
        }
    });
    */
    manifoldPointPositions = new EXP.Transformation({expr: (i,t,x) => pointPath(i,t,x)});
    manifoldPointOutput = new EXP.PointOutput({width:0.2, color: pointColor});

    multipleManifoldPoints
    .add(manifoldPointPositions)
    .add(manifoldPointOutput);

    xAxis = new EXP.Area({bounds: [[0,1]], numItems: 2});
    xAxisControl = new EXP.Transformation({expr: (i,t,x,y,z) => [x,y,z]});
    xAxis
    .add(new EXP.Transformation({expr: (i,t,x) => [axisSize*x,0,0]}))
    .add(xAxisControl)
    .add(new EXP.VectorOutput({width:3, color: coordinateLine1Color}));
    
    xAxis
    .add(new EXP.Transformation({expr: (i,t,x) => [-axisSize*x,0,0]}))
    .add(xAxisControl.makeLink())
    .add(new EXP.VectorOutput({width:3, color: coordinateLine1Color}));

    yAxis = new EXP.Area({bounds: [[0,1]], numItems: 2});
    yAxisControl = new EXP.Transformation({expr: (i,t,x,y,z) => [x,y,z]});
    yAxis
    .add(new EXP.Transformation({expr: (i,t,x) => [0,axisSize*x,0]}))
    .add(yAxisControl)
    .add(new EXP.VectorOutput({width:3, color: coordinateLine2Color}));
    yAxis
    .add(new EXP.Transformation({expr: (i,t,x) => [0,-axisSize*x,0]}))
    .add(yAxisControl.makeLink())
    .add(new EXP.VectorOutput({width:3, color: coordinateLine2Color}));

    let zAxis = new EXP.Area({bounds: [[0,1]], numItems: 2});
    zAxisControl = new EXP.Transformation({expr: (i,t,x,y,z) => [x,y,z]});
    zAxis
    .add(new EXP.Transformation({expr: (i,t,x) => [0,0,axisSize*x]}))
    .add(zAxisControl)
    .add(new EXP.VectorOutput({width:3, color: coordinateLine3Color}));
    zAxis
    .add(new EXP.Transformation({expr: (i,t,x) => [0,0,-axisSize*x]}))
    .add(zAxisControl.makeLink())
    .add(new EXP.VectorOutput({width:3, color: coordinateLine3Color}));

    //the fourth dimension!
    wAxis = new EXP.Area({bounds: [[0,1]], numItems: 2});
    wAxis
    .add(new EXP.Transformation({expr: (i,t,x) => [(axisSize*x),-(1)*3/4,0]}))
    .add(new EXP.VectorOutput({width:3, color: coordinateLine4Color, opacity:0}));
    wAxis
    .add(new EXP.Transformation({expr: (i,t,x) => [-(axisSize*x),-(1)*3/4,0]}))
    .add(new EXP.VectorOutput({width:3, color: coordinateLine4Color, opacity:0}));

    //the point vector
    wAxis
    .add(new EXP.Transformation({expr: (i,t,x) => i==0 ? [0,-(1)*3/4,0]: [pointCoords[3],-(1)*3/4,0]}))
    .add(new EXP.VectorOutput({width:15, color: coordinateLine4Color, opacity:0}));

    //the point on the w axis
    let fourthManifoldPoint = new EXP.Array({data: [[0]]});
    let wAxisDotPosition = new EXP.Transformation({expr: (i,t,x) => [pointCoords[3],-(1)*3/4,0]});
    manifold4PointOutput = new EXP.PointOutput({width:0.2, color: pointColor, opacity:0});

    fourthManifoldPoint
    .add(wAxisDotPosition)
    .add(manifold4PointOutput);


    pointCoordinateArrows = new EXP.Area({bounds: [[0,1]], numItems: 2});
    pointCoordinateArrows
    .add(manifoldPoint.makeLink())
    .add(new EXP.Transformation({expr: (i,t,x,y,z) => i==0 ? [0,0,0]: [x,0,0]}))
    .add(new EXP.VectorOutput({width:15, color: coordinateLine1Color}));

    pointCoordinateArrows
    .add(manifoldPoint.makeLink())
    .add(new EXP.Transformation({expr: (i,t,x,y,z) => i==0 ? [x,0,0]: [x,y,0]}))
    .add(new EXP.VectorOutput({width:15, color: coordinateLine2Color}));

    pointCoordinateArrows
    .add(manifoldPoint.makeLink())
    .add(new EXP.Transformation({expr: (i,t,x,y,z) => i==0 ? [x,y,0]: [x,y,z]}))
    .add(new EXP.VectorOutput({width:15, color: coordinateLine3Color}));

    //read out the point's coords
    manifoldPoint.add(new EXP.Transformation({expr: (i,t,x,y,z,w) => pointCoords=[x,y,z,w]}))

    let pointUpdater = {'activate':function(){
        document.getElementById("coord1").innerHTML = format(pointCoords[0]);
        document.getElementById("coord2").innerHTML = format(pointCoords[1]);
        document.getElementById("coord3").innerHTML = format(pointCoords[2]);
        document.getElementById("coord4").innerHTML = format(pointCoords[3]);
    }};


    document.getElementById("coord1").style.color = coordinateLine1Color;
    document.getElementById("coord2").style.color = coordinateLine2Color;
    document.getElementById("coord3").style.color = coordinateLine3Color;
    document.getElementById("coord4").style.color = coordinateLine4Color;

	presentation = new EXP.UndoCapableDirector();

    objects = [threeDPoint, torus, threeDPoint, fourthManifoldPoint, xAxis, yAxis, zAxis, wAxis, pointCoordinateArrows, pointUpdater, multipleManifoldPoints];
}

function format(x){
    return Number(x).toFixed(2);
}


async function animate(){
    await presentation.begin();

    //technically this is a string. the CSS animation handles the transition.
    //let threeDCoords = document.getElementById("coords");
    //presentation.TransitionTo(threeDCoords.style, {'opacity':1}, 0);

    await presentation.nextSlide();

    //this is the slide where we break R^3 into 3 lines.
    //re-center camera
    presentation.TransitionTo(controls, {'autoRotateSpeed':0}, 250);
    await presentation.delay(300);
    presentation.TransitionTo(controls, {'autoRotate':false}, 0);

    presentation.TransitionTo(three.camera.position, {'x':0,'y':0,'z':3}, 1000);
    presentation.TransitionTo(three.camera.rotation,{'x':0,'y':0,'z':0},1000);

    await presentation.delay(1500);
    
    //separate axes
    [xAxisControl,yAxisControl,zAxisControl].forEach((item, axisNumber) => {
        presentation.TransitionTo(item, {'expr': (i,t,x,y,z)=>[x+y+z, (-axisNumber+2)*3/4, 0]}, 1500);
    });

    //separate out the arrows for each individual coordinate
    pointCoordinateArrows.children.forEach((manifoldLink, axisNumber) => {
        let arrowSetter = manifoldLink.children[0]
    
        presentation.TransitionTo(arrowSetter, {
            expr: (i,t,x,y,z) => {
                if(i==0){
                    return [0, (-axisNumber+2)*3/4, 0];
                }else{
                    let coordinate = [x,y,z][axisNumber];
                    return [coordinate, (-axisNumber+2)*3/4, 0];
                }
            }
        }, 1500);
    });

    //move 3 points with them
    presentation.TransitionTo(manifoldPointPositions, {expr: (i,t,x) => {
        let point3DPos = pointPath(i,t,x); 
        let returnedPos = [point3DPos[i],(-i+2)*3/4,0];
        return returnedPos;
        }
    },1500);
   
    
    await presentation.nextSlide();
    //let's show that 4th axis!
    await presentation.delay(250);
    //CSS animation
    let threeDCoords = document.getElementById("coord4Reveal");
    presentation.TransitionTo(threeDCoords.style, {'fontSize':""}, 0);

    //show w axis
    wAxis.getDeepestChildren().forEach((output) => {
        presentation.TransitionTo(output, {'opacity':1}, 1000);
    });
    //show w axis point
    presentation.TransitionTo(manifold4PointOutput, {'opacity':1},1000);
    

    await presentation.nextSlide();
    await presentation.nextSlide();
    await presentation.nextSlide();
}

window.addEventListener("load",function(){
    setup();
    animate();
    setColors("x",coordinateLine1ColorDarker);
    setColors("y",coordinateLine2ColorDarker);
    setColors("z",coordinateLine3ColorDarker);
    setColors("w",coordinateLine4Color);
});

function setColors(className, color){
    let x = document.getElementsByClassName(className);
    for(var i=0;i<x.length;i++){
        x[i].style.color = color;
    }
}

//debugging code
//window.setInterval(() => { userPointParams.x1 += 0.1/30; userPointParams.x2 += 0.1/30;},1/30);
