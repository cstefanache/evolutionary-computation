var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
System.register("Num", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Num;
    return {
        setters:[],
        execute: function() {
            Num = (function () {
                function Num() {
                }
                Num.getRandomNum = function (min, max, precision) {
                    if (min === void 0) { min = 0; }
                    if (max === void 0) { max = 1; }
                    var result = min + (Math.random() * (max - min));
                    if (precision !== undefined) {
                        var power = Math.pow(10, precision);
                        result = Math.round(result * power) / power;
                    }
                    return result;
                };
                Num.randomInt = function (min, max) {
                    if (min === void 0) { min = 0; }
                    if (max === void 0) { max = 1; }
                    return Num.getRandomNum(min, max, 0);
                };
                Num.randomArrPicker = function (arr) {
                    return arr[Math.round(Math.random() * (arr.length - 1))];
                };
                Num.roundToPrecision = function (value, precision) {
                    var pow = Math.pow(10, 6);
                    var val = Math.round(value * pow) / pow;
                    return val;
                };
                return Num;
            }());
            exports_1("Num", Num);
        }
    }
});
System.register("models/FieldDef", ["Num"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Num_1;
    var FieldType, FieldDef, OutputField, NumericField, JSField;
    return {
        setters:[
            function (Num_1_1) {
                Num_1 = Num_1_1;
            }],
        execute: function() {
            FieldType = (function () {
                function FieldType() {
                }
                FieldType.NUMERIC = 0;
                FieldType.ANY = 1;
                return FieldType;
            }());
            exports_2("FieldType", FieldType);
            FieldDef = (function () {
                function FieldDef(name, defaultValue) {
                    this.type = -1;
                    this.name = name;
                    this.value = this.defaultValue = defaultValue;
                }
                FieldDef.prototype.filter = function (value) {
                    return value;
                };
                FieldDef.prototype.describe = function () {
                    var definition = "Declares: " + this.name;
                    if (this instanceof OutputField) {
                        definition += " as output field";
                        if (this.defaultValue !== undefined) {
                            definition += " with " + this.defaultValue + " as default value";
                        }
                    }
                    else {
                        definition += " as field with (";
                        definition += this.min !== undefined ? " min:" + this.min : "";
                        definition += this.max !== undefined ? " max:" + this.max : "";
                        definition += this.precision !== undefined ? " precision:" + this.precision : "";
                        definition += ")";
                    }
                    return definition;
                };
                return FieldDef;
            }());
            exports_2("FieldDef", FieldDef);
            OutputField = (function (_super) {
                __extends(OutputField, _super);
                function OutputField(name, defaultValue) {
                    _super.call(this, name, defaultValue);
                    this.type = FieldType.ANY;
                }
                OutputField.prototype.getInitialValue = function () {
                    return _.clone(this.value);
                };
                return OutputField;
            }(FieldDef));
            exports_2("OutputField", OutputField);
            NumericField = (function (_super) {
                __extends(NumericField, _super);
                function NumericField(name, min, max, precision, defaultValue) {
                    if (precision === void 0) { precision = 6; }
                    _super.call(this, name, defaultValue);
                    this.min = min;
                    this.max = max;
                    this.precision = precision;
                    this.defaultValue = defaultValue;
                    this.type = FieldType.NUMERIC;
                }
                NumericField.prototype.filter = function (value) {
                    if (this.min !== undefined && value < this.min) {
                        return this.min;
                    }
                    if (this.max !== undefined && value > this.max) {
                        return this.max;
                    }
                    if (this.precision !== undefined) {
                        return Num_1.Num.roundToPrecision(value, this.precision);
                    }
                    return value;
                };
                NumericField.prototype.getInitialValue = function () {
                    if (this.defaultValue === undefined) {
                        return Num_1.Num.getRandomNum(this.min, this.max, this.precision);
                    }
                };
                return NumericField;
            }(FieldDef));
            exports_2("NumericField", NumericField);
            JSField = (function () {
                function JSField() {
                }
                JSField.get = function (config) {
                    if (!config.name) {
                        throw new Error("JSField must be initialized with a name.");
                    }
                    var field;
                    if (config.numeric) {
                        var numData = config.numeric;
                        if (!numData.min || !numData.max) {
                            throw new Error("Please provide min and max value for numeric field [" + config.name + "].");
                        }
                        field = new NumericField(config.name, numData.min, numData.max, numData.precision, config.defaultValue);
                    }
                    else {
                        field = new OutputField(config.name, config.defaultValue);
                    }
                    return field;
                };
                return JSField;
            }());
            exports_2("JSField", JSField);
        }
    }
});
System.register("models/Individual", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var Individual;
    return {
        setters:[],
        execute: function() {
            Individual = (function () {
                function Individual() {
                    this.fieldsMap = {};
                    this.fieldsDefMap = {};
                }
                Individual.prototype.getValue = function (name) {
                    return this.fieldsMap[name];
                };
                Individual.prototype.getFieldDefinition = function (name) {
                    return this.fieldsDefMap[name];
                };
                Individual.prototype.setValue = function (name, value) {
                    this.fieldsMap[name] = this.fieldsDefMap[name].filter(value);
                };
                Individual.prototype.registerField = function (field) {
                    this.fieldsMap[field.name] = field.getInitialValue();
                    this.fieldsDefMap[field.name] = field;
                };
                return Individual;
            }());
            exports_3("Individual", Individual);
        }
    }
});
System.register("models/Population", ["models/Individual"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var Individual_1;
    var Population;
    return {
        setters:[
            function (Individual_1_1) {
                Individual_1 = Individual_1_1;
            }],
        execute: function() {
            Population = (function () {
                function Population(numIndividuals) {
                    this.fields = [];
                    this.inputFields = [];
                    this.individuals = [];
                    this.cache = {};
                    if (numIndividuals) {
                        for (var i = 0; i < numIndividuals; i++) {
                            this.individuals.unshift(new Individual_1.Individual());
                        }
                    }
                }
                Population.prototype.requestIndividual = function () {
                    return this.rind();
                };
                Population.prototype.removeIndividual = function (individual) {
                    var individuals = this.individuals;
                    individuals.splice(individuals.indexOf(individual), 1);
                };
                return Population;
            }());
            exports_4("Population", Population);
        }
    }
});
System.register("models/Operator", ["models/FieldDef"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var FieldDef_1;
    var Operator, JSOperator;
    return {
        setters:[
            function (FieldDef_1_1) {
                FieldDef_1 = FieldDef_1_1;
            }],
        execute: function() {
            Operator = (function () {
                function Operator(name) {
                    this.numExecutions = 1;
                    this.name = name;
                }
                Operator.prototype.addOperator = function (operator) {
                    if (this.operators === undefined) {
                        this.operators = new Array();
                    }
                    this.operators.push(operator);
                };
                Operator.prototype.getCurrentPopulation = function () {
                    return this.currentRunning;
                };
                return Operator;
            }());
            exports_5("Operator", Operator);
            JSOperator = (function (_super) {
                __extends(JSOperator, _super);
                function JSOperator(name, executeFunction, isIndividual, fieldsDef) {
                    _super.call(this, name);
                    this.execute = executeFunction;
                    this.isIndividual = isIndividual;
                    this.fieldsDefObj = fieldsDef;
                }
                JSOperator.prototype.getFieldDefinition = function () {
                    var arrFieldDef;
                    if (this.fieldsDefObj) {
                        arrFieldDef = [];
                        for (var _i = 0, _a = this.fieldsDefObj; _i < _a.length; _i++) {
                            var fieldDef = _a[_i];
                            arrFieldDef.push(FieldDef_1.JSField.get(fieldDef));
                        }
                    }
                    return arrFieldDef;
                };
                JSOperator.prototype.doExecute = function (individual, population) {
                    this.currentRunning = population;
                    if (this.isIndividual) {
                        for (var _i = 0, _a = population.individuals; _i < _a.length; _i++) {
                            var ind = _a[_i];
                            this.execute(ind);
                        }
                    }
                    else {
                        this.execute(population);
                    }
                };
                return JSOperator;
            }(Operator));
            exports_5("JSOperator", JSOperator);
        }
    }
});
System.register("models/GroupOperator", ["models/Operator"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var Operator_1;
    var GroupOperator;
    return {
        setters:[
            function (Operator_1_1) {
                Operator_1 = Operator_1_1;
            }],
        execute: function() {
            GroupOperator = (function (_super) {
                __extends(GroupOperator, _super);
                function GroupOperator(name, numExecutions) {
                    if (numExecutions === void 0) { numExecutions = 1; }
                    _super.call(this, name);
                    this.numExecutions = numExecutions;
                }
                GroupOperator.prototype.getFieldDefinition = function () {
                    return [];
                };
                GroupOperator.prototype.doExecute = function (individual, population) {
                    this.currentRunning = population;
                    if (!this.operators)
                        return;
                    for (var i = 0; i < this.numExecutions; i++) {
                        for (var _i = 0, _a = this.operators; _i < _a.length; _i++) {
                            var operator = _a[_i];
                            operator.doExecute(individual, population);
                        }
                    }
                };
                GroupOperator = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [Object, Number])
                ], GroupOperator);
                return GroupOperator;
            }(Operator_1.Operator));
            exports_6("GroupOperator", GroupOperator);
        }
    }
});
System.register("models/IndividualOperator", ["models/Operator"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var Operator_2;
    var IndividualOperator;
    return {
        setters:[
            function (Operator_2_1) {
                Operator_2 = Operator_2_1;
            }],
        execute: function() {
            IndividualOperator = (function (_super) {
                __extends(IndividualOperator, _super);
                function IndividualOperator() {
                    _super.apply(this, arguments);
                }
                IndividualOperator.prototype.doExecute = function (individual, population) {
                    this.currentRunning = population;
                    for (var _i = 0, _a = population.individuals; _i < _a.length; _i++) {
                        var ind = _a[_i];
                        this.execute(ind);
                    }
                };
                IndividualOperator = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [])
                ], IndividualOperator);
                return IndividualOperator;
            }(Operator_2.Operator));
            exports_7("IndividualOperator", IndividualOperator);
        }
    }
});
System.register("models/PopulationOperator", ["models/Operator"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var Operator_3;
    var PopulationOperator;
    return {
        setters:[
            function (Operator_3_1) {
                Operator_3 = Operator_3_1;
            }],
        execute: function() {
            PopulationOperator = (function (_super) {
                __extends(PopulationOperator, _super);
                function PopulationOperator() {
                    _super.apply(this, arguments);
                }
                PopulationOperator.prototype.doExecute = function (individual, population) {
                    this.currentRunning = population;
                    this.execute(population);
                };
                return PopulationOperator;
            }(Operator_3.Operator));
            exports_8("PopulationOperator", PopulationOperator);
        }
    }
});
System.register("Log", [], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var Log;
    return {
        setters:[],
        execute: function() {
            Log = (function () {
                function Log() {
                }
                Log.error = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    console.error(args);
                };
                Log.info = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    console.log(args);
                };
                return Log;
            }());
            exports_9("Log", Log);
        }
    }
});
System.register("hud/GuiHud", [], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var GuiHud;
    return {
        setters:[],
        execute: function() {
            GuiHud = (function () {
                function GuiHud(app, populationDefault) {
                    if (populationDefault === void 0) { populationDefault = 100; }
                    if (!window) {
                        throw new Error("Window object is missing. Not in a browser environment?");
                    }
                    this.app = app;
                    var style = document.createElement("style");
                    style.appendChild(document.createTextNode(".cm-btn {" +
                        "   background-color: #FFFFFF; " +
                        "   border-radius: 2px; " +
                        "   padding: 6px; " +
                        "   margin: 2px;" +
                        "   box-shadow: 0px 0px 1px rgba(0,0,0,125);" +
                        "   -webkit-touch-callout: none; " +
                        "   -webkit-user-select: none;   " +
                        "   -khtml-user-select: none;    " +
                        "   -moz-user-select: none;      " +
                        "   -ms-user-select: none;       " +
                        "   user-select: none;           " +
                        "}" +
                        ".cm-btn:hover {" +
                        "   background-color: #FFFFFF; " +
                        "   cursor:pointer; " +
                        "   margin: 0px;" +
                        "   padding: 8px;" +
                        "   box-shadow: 0px 0px 6px rgba(0,0,0,125);" +
                        "}" +
                        ""));
                    document.head.appendChild(style);
                    var root = window.document.createElement('div');
                    root.style.position = "fixed";
                    root.style.backgroundColor = "rgba(0,0,0,0.2)";
                    root.style.padding = "10px";
                    root.style.right = "20px";
                    root.style.bottom = "20px";
                    var stop;
                    var start;
                    var tick;
                    start = this.addButton(root, "Start", function () {
                        stop.style.display = "inline-block";
                        start.style.display = "none";
                        tick.style.display = "none";
                        app.start();
                    });
                    stop = this.addButton(root, "Stop", function () {
                        start.style.display = "inline-block";
                        tick.style.display = "inline-block";
                        stop.style.display = "none";
                        app.stop();
                    });
                    tick = this.addButton(root, "Tick", function () {
                        app.tick();
                    });
                    stop.style.display = "none";
                    var populationNumber = window.document.createElement('input');
                    populationNumber.value = populationDefault + "";
                    populationNumber.style.width = "50px";
                    var addPop = this.addButton(root, "+ Population", function () {
                        app.addPopulation(parseInt(populationNumber.value));
                    });
                    addPop.appendChild(populationNumber);
                    this.addButton(root, "Reset", function () {
                        app.resetPopulations();
                        app.addPopulation(parseInt(populationNumber.value));
                    });
                    window.document.body.appendChild(root);
                }
                GuiHud.prototype.addButton = function (root, name, callback) {
                    var button = window.document.createElement('span');
                    button.innerHTML = name;
                    button.className = "cm-btn";
                    button.addEventListener('click', function () {
                        callback();
                    });
                    root.appendChild(button);
                    return button;
                };
                return GuiHud;
            }());
            exports_10("GuiHud", GuiHud);
        }
    }
});
System.register("operators/objective/Schwefel", ["models/FieldDef", "models/IndividualOperator", "Num"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var FieldDef_2, FieldDef_3, IndividualOperator_1, Num_2;
    var Schwefel;
    return {
        setters:[
            function (FieldDef_2_1) {
                FieldDef_2 = FieldDef_2_1;
                FieldDef_3 = FieldDef_2_1;
            },
            function (IndividualOperator_1_1) {
                IndividualOperator_1 = IndividualOperator_1_1;
            },
            function (Num_2_1) {
                Num_2 = Num_2_1;
            }],
        execute: function() {
            Schwefel = (function (_super) {
                __extends(Schwefel, _super);
                function Schwefel() {
                    _super.call(this, 'Schwefel');
                    this.X_FIELD_NAME = 'x';
                    this.Y_FIELD_NAME = 'y';
                }
                Schwefel.prototype.execute = function (individual) {
                    var x = individual.getValue(this.X_FIELD_NAME);
                    var y = individual.getValue(this.Y_FIELD_NAME);
                    var sum = 0;
                    sum += x * Math.sin(Math.sqrt(Math.abs(x)));
                    sum += y * Math.sin(Math.sqrt(Math.abs(y)));
                    var value = sum + 2 * 4.18982887272434686131e+02;
                    individual.setValue(Schwefel.OBJ_FIELD_NAME, Num_2.Num.roundToPrecision(value, Schwefel.PRECISION));
                };
                Schwefel.prototype.getName = function () {
                    return "Schwefel";
                };
                Schwefel.prototype.getFieldDefinition = function () {
                    var x = new FieldDef_3.NumericField(this.X_FIELD_NAME, -500, 500, Schwefel.PRECISION);
                    var y = new FieldDef_3.NumericField(this.Y_FIELD_NAME, -500, 500, Schwefel.PRECISION);
                    var value = new FieldDef_2.OutputField(Schwefel.OBJ_FIELD_NAME);
                    return [x, y, value];
                };
                Schwefel.OBJ_FIELD_NAME = 'schwefel';
                Schwefel.PRECISION = 10;
                Schwefel = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [])
                ], Schwefel);
                return Schwefel;
            }(IndividualOperator_1.IndividualOperator));
            exports_11("Schwefel", Schwefel);
        }
    }
});
System.register("operators/ranking/MinRank", ["models/PopulationOperator", "models/FieldDef"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var PopulationOperator_1, FieldDef_4;
    var MinRank;
    return {
        setters:[
            function (PopulationOperator_1_1) {
                PopulationOperator_1 = PopulationOperator_1_1;
            },
            function (FieldDef_4_1) {
                FieldDef_4 = FieldDef_4_1;
            }],
        execute: function() {
            MinRank = (function (_super) {
                __extends(MinRank, _super);
                function MinRank(fieldSort) {
                    _super.call(this, "MinRank");
                    this.fieldSort = fieldSort;
                }
                MinRank.prototype.execute = function (population) {
                    var _this = this;
                    population.individuals = _.sortBy(population.individuals, function (ind) {
                        return ind.getValue(_this.fieldSort);
                    });
                    _.each(population.individuals, function (ind, index) {
                        ind.setValue(MinRank.FIELD, index);
                    });
                };
                MinRank.prototype.getFieldDefinition = function () {
                    return [new FieldDef_4.OutputField(MinRank.FIELD, 0)];
                };
                MinRank.FIELD = 'rank';
                MinRank = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [String])
                ], MinRank);
                return MinRank;
            }(PopulationOperator_1.PopulationOperator));
            exports_12("MinRank", MinRank);
        }
    }
});
System.register("operators/renderers/CanvasRenderer", ["models/PopulationOperator"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var PopulationOperator_2;
    var CanvasRenderer;
    return {
        setters:[
            function (PopulationOperator_2_1) {
                PopulationOperator_2 = PopulationOperator_2_1;
            }],
        execute: function() {
            CanvasRenderer = (function (_super) {
                __extends(CanvasRenderer, _super);
                function CanvasRenderer(xfield, yfield, scale) {
                    _super.call(this, "Canvas View");
                    this.width = 400;
                    this.height = 300;
                    this.scale = scale;
                    this.xfield = xfield;
                    this.yfield = yfield;
                    if (window) {
                        this.canvas = $('<canvas style="border:1px solid #000;" width="' + this.width + 'px" height="' + this.height + 'px"></canvas>');
                        var that = this;
                        this.canvas.click(function () {
                            var scaleX = that.scale && that.scale[that.xfield] !== undefined ? that.scale[that.xfield] : undefined;
                            var scaleY = that.scale && that.scale[that.yfield] !== undefined ? that.scale[that.yfield] : undefined;
                            scaleX[0] += 0.001;
                            scaleX[1] -= 0.001;
                            scaleY[0] += 0.001;
                            scaleY[1] -= 0.001;
                        });
                        $(document.body).append(this.canvas);
                    }
                }
                CanvasRenderer.prototype.execute = function (population) {
                    var canvas = this.canvas[0];
                    if (canvas.getContext) {
                        var ctx = canvas.getContext('2d');
                        //ctx.clearRect(0, 0, this.width, this.height);
                        ctx.globalAlpha = 0.2;
                        ctx.fillStyle = "white";
                        ctx.fillRect(0, 0, this.width, this.height);
                        ctx.globalAlpha = 1;
                        ctx.fillStyle = population.color;
                        var idx = 0;
                        for (var _i = 0, _a = population.individuals; _i < _a.length; _i++) {
                            var ind = _a[_i];
                            idx++;
                            var x = ind.getValue(this.xfield);
                            var y = ind.getValue(this.yfield);
                            var scaleX = this.scale && this.scale[this.xfield] !== undefined ? this.scale[this.xfield] : undefined;
                            var scaleY = this.scale && this.scale[this.yfield] !== undefined ? this.scale[this.yfield] : undefined;
                            if (scaleX) {
                                x = (Math.abs(x - scaleX[0]) / Math.abs(scaleX[1] - scaleX[0])) * this.width;
                            }
                            if (scaleY) {
                                y = (Math.abs(y - scaleY[0]) / Math.abs(scaleY[1] - scaleY[0])) * this.height;
                            }
                            // ctx.globalAlpha  = (1-idx/population.individuals.length);
                            // ctx.fillStyle=population.color;
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }
                };
                CanvasRenderer.prototype.getFieldDefinition = function () {
                    return undefined;
                };
                CanvasRenderer = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [String, String, Object])
                ], CanvasRenderer);
                return CanvasRenderer;
            }(PopulationOperator_2.PopulationOperator));
            exports_13("CanvasRenderer", CanvasRenderer);
        }
    }
});
System.register("operators/misc/GrimReaper", ["models/IndividualOperator", "models/FieldDef", "Num"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var IndividualOperator_2, FieldDef_5, Num_3;
    var GrimReaper;
    return {
        setters:[
            function (IndividualOperator_2_1) {
                IndividualOperator_2 = IndividualOperator_2_1;
            },
            function (FieldDef_5_1) {
                FieldDef_5 = FieldDef_5_1;
            },
            function (Num_3_1) {
                Num_3 = Num_3_1;
            }],
        execute: function() {
            GrimReaper = (function (_super) {
                __extends(GrimReaper, _super);
                function GrimReaper(avgAge, regenerate) {
                    if (regenerate === void 0) { regenerate = true; }
                    _super.call(this, 'GrimReaper');
                    this.avgAge = avgAge || 100;
                    this.regenerate = regenerate;
                }
                GrimReaper.prototype.execute = function (individual) {
                    var age = individual.getValue("age");
                    var rand = Num_3.Num.getRandomNum();
                    if (rand < age / this.avgAge) {
                        this.getCurrentPopulation().removeIndividual(individual);
                        if (this.regenerate)
                            this.getCurrentPopulation().requestIndividual();
                    }
                    individual.setValue("age", age + 1);
                };
                GrimReaper.prototype.getFieldDefinition = function () {
                    return [new FieldDef_5.OutputField("age", 1)];
                };
                GrimReaper = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [Number, Boolean])
                ], GrimReaper);
                return GrimReaper;
            }(IndividualOperator_2.IndividualOperator));
            exports_14("GrimReaper", GrimReaper);
        }
    }
});
System.register("operators/misc/RandomIndividualGenerator", ["Num", "models/PopulationOperator"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var Num_4, PopulationOperator_3;
    var RandomIndividualGenerator;
    return {
        setters:[
            function (Num_4_1) {
                Num_4 = Num_4_1;
            },
            function (PopulationOperator_3_1) {
                PopulationOperator_3 = PopulationOperator_3_1;
            }],
        execute: function() {
            RandomIndividualGenerator = (function (_super) {
                __extends(RandomIndividualGenerator, _super);
                function RandomIndividualGenerator(generateNum, chance) {
                    if (generateNum === void 0) { generateNum = 5; }
                    if (chance === void 0) { chance = 0.1; }
                    _super.call(this, "Random Individual Generator");
                    this.num = generateNum;
                    this.chance = chance;
                }
                RandomIndividualGenerator.prototype.execute = function (population) {
                    for (var i = 0; i < this.num; i++) {
                        if (Num_4.Num.getRandomNum() < this.chance) {
                            population.requestIndividual();
                        }
                    }
                };
                RandomIndividualGenerator.prototype.getFieldDefinition = function () {
                    return undefined;
                };
                RandomIndividualGenerator = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [Number, Number])
                ], RandomIndividualGenerator);
                return RandomIndividualGenerator;
            }(PopulationOperator_3.PopulationOperator));
            exports_15("RandomIndividualGenerator", RandomIndividualGenerator);
        }
    }
});
System.register("operators/swarm/PSOA", ["models/PopulationOperator", "models/FieldDef", "Num"], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var PopulationOperator_4, FieldDef_6, Num_5;
    var PSOA;
    return {
        setters:[
            function (PopulationOperator_4_1) {
                PopulationOperator_4 = PopulationOperator_4_1;
            },
            function (FieldDef_6_1) {
                FieldDef_6 = FieldDef_6_1;
            },
            function (Num_5_1) {
                Num_5 = Num_5_1;
            }],
        execute: function() {
            PSOA = (function (_super) {
                __extends(PSOA, _super);
                function PSOA(fitness, omega, c1, c2) {
                    if (omega === void 0) { omega = 0.85; }
                    if (c1 === void 0) { c1 = 0.1; }
                    if (c2 === void 0) { c2 = 0.1; }
                    _super.call(this, 'PSOA');
                    this.omega = omega;
                    this.c1 = c1;
                    this.c2 = c2;
                    this.fitness = fitness;
                }
                PSOA.prototype.execute = function (population) {
                    //assuming that is already ranked
                    var best = population.individuals[0].getValue("PSOData");
                    var omega = this.omega;
                    var c1 = this.c1;
                    var c2 = this.c2;
                    for (var i = 0; i < population.individuals.length; i++) {
                        var currentIndividual = population.individuals[i];
                        var psoData = currentIndividual.getValue("PSOData");
                        for (var _i = 0, _a = population.inputFields; _i < _a.length; _i++) {
                            var field = _a[_i];
                            var pb = psoData[field];
                            if (!pb || currentIndividual.getValue(this.fitness) < psoData[this.fitness]) {
                                var currentValue = currentIndividual.getValue(field);
                                psoData[field] = pb = currentValue;
                            }
                        }
                        psoData[this.fitness] = currentIndividual.getValue(this.fitness);
                        for (var _b = 0, _c = population.inputFields; _b < _c.length; _b++) {
                            var field = _c[_b];
                            var pb = psoData[field];
                            var velocityKey = 'v.' + field;
                            //x,y,z
                            var currentValue = currentIndividual.getValue(field);
                            var velocity = psoData[velocityKey];
                            if (velocity === undefined) {
                                psoData[velocityKey] = velocity = 0;
                            }
                            psoData[velocityKey] = omega * velocity + (c1 * Num_5.Num.getRandomNum() * (pb - currentValue)) + (c2 * Num_5.Num.getRandomNum() * (best[field] - currentValue));
                            currentIndividual.setValue(field, currentValue + psoData[velocityKey]);
                        }
                    }
                };
                PSOA.prototype.getFieldDefinition = function () {
                    return [new FieldDef_6.OutputField("PSOData", {})];
                };
                PSOA = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [String, Number, Number, Number])
                ], PSOA);
                return PSOA;
            }(PopulationOperator_4.PopulationOperator));
            exports_16("PSOA", PSOA);
        }
    }
});
System.register("operators/ranking/LinearRanking", ["models/PopulationOperator", "models/FieldDef", "Num"], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var PopulationOperator_5, FieldDef_7, Num_6;
    var LinearRanking;
    return {
        setters:[
            function (PopulationOperator_5_1) {
                PopulationOperator_5 = PopulationOperator_5_1;
            },
            function (FieldDef_7_1) {
                FieldDef_7 = FieldDef_7_1;
            },
            function (Num_6_1) {
                Num_6 = Num_6_1;
            }],
        execute: function() {
            LinearRanking = (function (_super) {
                __extends(LinearRanking, _super);
                function LinearRanking(fieldSort) {
                    _super.call(this, "LinearRanking");
                    this.fieldSort = fieldSort;
                }
                LinearRanking.prototype.execute = function (population) {
                    var _this = this;
                    population.individuals = _.sortBy(population.individuals, function (ind) {
                        return ind.getValue(_this.fieldSort);
                    });
                    var size = population.individuals.length;
                    for (var i = 0; i < size; i++) {
                        var individual = population.individuals[i];
                        individual.setValue("linearRanking", Num_6.Num.roundToPrecision((2 * size + 1 - 2 * i) / size / size, 2));
                    }
                };
                LinearRanking.prototype.getFieldDefinition = function () {
                    return [new FieldDef_7.OutputField("linearRanking", 0)];
                };
                LinearRanking = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [String])
                ], LinearRanking);
                return LinearRanking;
            }(PopulationOperator_5.PopulationOperator));
            exports_17("LinearRanking", LinearRanking);
        }
    }
});
System.register("operators/renderers/TableRenderer", ["models/PopulationOperator"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var PopulationOperator_6;
    var TableRenderer;
    return {
        setters:[
            function (PopulationOperator_6_1) {
                PopulationOperator_6 = PopulationOperator_6_1;
            }],
        execute: function() {
            TableRenderer = (function (_super) {
                __extends(TableRenderer, _super);
                function TableRenderer(maxRows, cols, executeOnClick) {
                    _super.call(this, "Table View");
                    this.cols = cols;
                    this.executeOnClick = executeOnClick;
                    this.maxRows = maxRows;
                    if (window) {
                        this.tableElement = $('<table class="table table-striped"></table>');
                        $(document.body).append(this.tableElement);
                    }
                }
                TableRenderer.prototype.execute = function (population) {
                    if (population.index === 0) {
                        var htmlContent = '<thead><tr><th>&nbsp</th>';
                        for (var _i = 0, _a = this.cols ? this.cols : population.fields; _i < _a.length; _i++) {
                            var field = _a[_i];
                            htmlContent += '</th><th>' + field + '</th>';
                        }
                        htmlContent += "</tr></thead><tbody>";
                    }
                    var index = 0;
                    for (var _b = 0, _c = population.individuals; _b < _c.length; _b++) {
                        var ind = _c[_b];
                        if (this.maxRows !== undefined && index++ > this.maxRows)
                            break;
                        htmlContent += '<tr' +
                            this.executeOnClick ? ' click="' + this.executeOnClick + '"' : ''
                            + '><td style="background-color:' + population.color + '">&nbsp;</td>';
                        for (var _d = 0, _e = this.cols ? this.cols : population.fields; _d < _e.length; _d++) {
                            var field = _e[_d];
                            htmlContent += '<td>' + JSON.stringify(ind.getValue(field)) + '</td>';
                        }
                        htmlContent += '</tr>';
                    }
                    htmlContent += '</tbody>';
                    if (population.index === 0) {
                        this.tableElement.html(htmlContent);
                    }
                    else {
                        this.tableElement.find('tbody').append(htmlContent);
                    }
                };
                TableRenderer.prototype.getFieldDefinition = function () {
                    return undefined;
                };
                TableRenderer = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [Number, Array, String])
                ], TableRenderer);
                return TableRenderer;
            }(PopulationOperator_6.PopulationOperator));
            exports_18("TableRenderer", TableRenderer);
        }
    }
});
System.register("operators/selection/Roulette", ["models/PopulationOperator", "Num"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var PopulationOperator_7, Num_7;
    var Roulette;
    return {
        setters:[
            function (PopulationOperator_7_1) {
                PopulationOperator_7 = PopulationOperator_7_1;
            },
            function (Num_7_1) {
                Num_7 = Num_7_1;
            }],
        execute: function() {
            Roulette = (function (_super) {
                __extends(Roulette, _super);
                function Roulette(rankField, numSelected) {
                    if (numSelected === void 0) { numSelected = 2; }
                    _super.call(this, "Roulette");
                    this.rankField = rankField;
                    this.numSelected = numSelected;
                }
                Roulette.prototype.execute = function (population) {
                    var selection = [];
                    var individual;
                    for (var i = 0; i < this.numSelected; i++) {
                        var rand = Num_7.Num.getRandomNum();
                        var index = 0;
                        while (rand > 0 && index < population.individuals.length) {
                            individual = population.individuals[index];
                            var fitness = individual.getValue(this.rankField);
                            rand -= fitness;
                            index++;
                        }
                        selection.push(individual);
                    }
                    population.cache['selection'] = selection;
                };
                Roulette.prototype.getFieldDefinition = function () {
                    return undefined;
                };
                Roulette = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [String, Number])
                ], Roulette);
                return Roulette;
            }(PopulationOperator_7.PopulationOperator));
            exports_19("Roulette", Roulette);
        }
    }
});
System.register("operators/genetic/HauptGA", ["models/PopulationOperator", "Num", "models/FieldDef"], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var PopulationOperator_8, Num_8, FieldDef_8;
    var HauptGA;
    return {
        setters:[
            function (PopulationOperator_8_1) {
                PopulationOperator_8 = PopulationOperator_8_1;
            },
            function (Num_8_1) {
                Num_8 = Num_8_1;
            },
            function (FieldDef_8_1) {
                FieldDef_8 = FieldDef_8_1;
            }],
        execute: function() {
            HauptGA = (function (_super) {
                __extends(HauptGA, _super);
                function HauptGA(crossoverProbability, mutationProbabiliy) {
                    if (crossoverProbability === void 0) { crossoverProbability = 0.3; }
                    if (mutationProbabiliy === void 0) { mutationProbabiliy = 0.1; }
                    _super.call(this, 'HauptGA');
                    this.cp = 0.1;
                    this.mp = 0.1;
                    this.cp = crossoverProbability;
                    this.mp = mutationProbabiliy;
                }
                HauptGA.prototype.execute = function (population) {
                    var selection = population.cache['selection'];
                    var child1 = population.requestIndividual();
                    var child2 = population.requestIndividual();
                    var parent1 = selection[0];
                    var parent2 = selection[1];
                    for (var _i = 0, _a = population.inputFields; _i < _a.length; _i++) {
                        var field = _a[_i];
                        var fieldDef = parent1.getFieldDefinition(field);
                        //Apply only on numeric fields
                        if (fieldDef.type !== FieldDef_8.FieldType.NUMERIC) {
                            var parent1Value = parent1.getValue(field);
                            var parent2Value = parent2.getValue(field);
                            var crossoverValue = this.hauptCrossover(parent1Value, parent2Value);
                            if (Num_8.Num.getRandomNum() < this.cp) {
                                child1.setValue(field, crossoverValue[0]);
                                child2.setValue(field, crossoverValue[1]);
                            }
                            else {
                                child1.setValue(field, parent1Value);
                                child2.setValue(field, parent2Value);
                            }
                            if (Num_8.Num.getRandomNum() < this.mp) {
                                child1.setValue(field, this.hauptMutation(fieldDef.min, fieldDef.max));
                            }
                        }
                    }
                };
                HauptGA.prototype.getFieldDefinition = function () {
                    return undefined;
                };
                HauptGA.prototype.hauptCrossover = function (value1, value2) {
                    if (_.isNumber(value1) && _.isNumber(value1)) {
                        var beta = Num_8.Num.getRandomNum();
                        return [beta * value1 + (1 - beta) * value2, (1 - beta) * value1 + beta * value2];
                    }
                    else {
                        return [value1, value2];
                    }
                };
                HauptGA.prototype.hauptMutation = function (gmin, gmax) {
                    return gmin + Num_8.Num.getRandomNum() * (gmax - gmin);
                };
                HauptGA = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [Number, Number])
                ], HauptGA);
                return HauptGA;
            }(PopulationOperator_8.PopulationOperator));
            exports_20("HauptGA", HauptGA);
        }
    }
});
System.register("operators/misc/PopulationSizeControl", ["models/PopulationOperator"], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    var PopulationOperator_9;
    var PopulationSizeControl;
    return {
        setters:[
            function (PopulationOperator_9_1) {
                PopulationOperator_9 = PopulationOperator_9_1;
            }],
        execute: function() {
            PopulationSizeControl = (function (_super) {
                __extends(PopulationSizeControl, _super);
                function PopulationSizeControl(maxIndividuals) {
                    _super.call(this, "PopualationSizeControl");
                    if (!maxIndividuals) {
                        throw new Error("PopulationSizeControl needs maxIndividuals parameter to be passed as argument");
                    }
                    this.maxIndividuals = maxIndividuals;
                }
                PopulationSizeControl.prototype.execute = function (population) {
                    if (population.individuals.length > this.maxIndividuals) {
                        population.individuals.splice(this.maxIndividuals, population.individuals.length - this.maxIndividuals);
                    }
                };
                PopulationSizeControl.prototype.getFieldDefinition = function () {
                    return undefined;
                };
                PopulationSizeControl = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [Number])
                ], PopulationSizeControl);
                return PopulationSizeControl;
            }(PopulationOperator_9.PopulationOperator));
            exports_21("PopulationSizeControl", PopulationSizeControl);
        }
    }
});
System.register("Application", ["models/Population", "models/GroupOperator", "models/FieldDef", "models/Individual", "models/Operator", "Log", "hud/GuiHud"], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    var Population_1, GroupOperator_1, FieldDef_9, Individual_2, Operator_4, Log_1, GuiHud_1;
    var Application;
    return {
        setters:[
            function (Population_1_1) {
                Population_1 = Population_1_1;
            },
            function (GroupOperator_1_1) {
                GroupOperator_1 = GroupOperator_1_1;
            },
            function (FieldDef_9_1) {
                FieldDef_9 = FieldDef_9_1;
            },
            function (Individual_2_1) {
                Individual_2 = Individual_2_1;
            },
            function (Operator_4_1) {
                Operator_4 = Operator_4_1;
            },
            function (Log_1_1) {
                Log_1 = Log_1_1;
            },
            function (GuiHud_1_1) {
                GuiHud_1 = GuiHud_1_1;
            }],
        execute: function() {
            Application = (function () {
                function Application(callback) {
                    //    Application.instance = this;
                    this.colors = ['green', 'blue', 'red', 'orange', 'black', 'teal', 'pink', 'magenta', 'fuchsia'];
                    this.populations = [];
                    this.rootOperator = new GroupOperator_1.GroupOperator('root');
                    this.delay = 50;
                    this.populationSize = 100;
                    if (callback) {
                        Promise.all(Object.keys(System.defined).map(function (key) {
                            return System.import(key);
                        })).then(function () {
                            callback();
                        });
                    }
                }
                Application.prototype.numPopulations = function () {
                    return this.populations.length;
                };
                Application.prototype.addPopulation = function (populationSize) {
                    if (!this.rootOperator) {
                        this.rootOperator = new GroupOperator_1.GroupOperator("root");
                    }
                    var population = new Population_1.Population(populationSize || this.populationSize);
                    population.index = this.populations.length;
                    population.color = this.colors[this.populations.length];
                    var that = this;
                    population.rind = function () {
                        return that.requestIndividual();
                    };
                    this.preparePopulation(this.rootOperator, population);
                    this.populations.push(population);
                };
                Application.prototype.addOperator = function (operator, parent) {
                    var host = parent !== undefined ? parent : this.rootOperator;
                    host.addOperator(operator);
                    console.log(operator);
                    for (var _i = 0, _a = this.populations; _i < _a.length; _i++) {
                        var population = _a[_i];
                        this.preparePopulation(operator, population);
                    }
                };
                Application.prototype.preparePopulation = function (operator, population) {
                    var defs = operator.getFieldDefinition();
                    if (defs) {
                        for (var _i = 0, defs_1 = defs; _i < defs_1.length; _i++) {
                            var fieldDef = defs_1[_i];
                            population.fields.push(fieldDef.name);
                            if (!(fieldDef instanceof FieldDef_9.OutputField)) {
                                population.inputFields.push(fieldDef.name);
                            }
                            for (var _a = 0, _b = population.individuals; _a < _b.length; _a++) {
                                var individual = _b[_a];
                                individual.registerField(fieldDef);
                            }
                        }
                    }
                    if (operator.operators !== undefined) {
                        for (var _c = 0, _d = operator.operators; _c < _d.length; _c++) {
                            var op = _d[_c];
                            this.preparePopulation(op, population);
                        }
                    }
                };
                Application.prototype.requestIndividual = function () {
                    var individual = new Individual_2.Individual();
                    this.registerOperator(this.rootOperator, individual);
                    this.currentPopulation.individuals.unshift(individual);
                    return individual;
                };
                Application.prototype.resetPopulations = function () {
                    this.populations = [];
                };
                Application.prototype.tick = function () {
                    for (var _i = 0, _a = this.populations; _i < _a.length; _i++) {
                        var pop = _a[_i];
                        this.currentPopulation = pop;
                        this.rootOperator.doExecute(undefined, pop);
                    }
                };
                Application.prototype.start = function (numTicks) {
                    if (this.interval) {
                        return;
                    }
                    var ticks = 0;
                    var that = this;
                    this.interval = setInterval(function () {
                        ticks++;
                        that.tick();
                        if (numTicks && ticks > numTicks) {
                            that.stop();
                        }
                    }, this.delay);
                };
                Application.prototype.stop = function () {
                    if (this.interval) {
                        clearInterval(this.interval);
                        this.interval = undefined;
                    }
                };
                //public getOperator(name:string):Operator {
                //    var op:Operator;
                //    import TestAction = require('./action/TestAction');
                //    var myAction = new TestAction();
                //    return op;
                //}
                Application.prototype.registerOperator = function (operator, individual) {
                    var defs = operator.getFieldDefinition();
                    if (defs) {
                        for (var _i = 0, defs_2 = defs; _i < defs_2.length; _i++) {
                            var fieldDef = defs_2[_i];
                            individual.registerField(fieldDef);
                        }
                    }
                    if (operator.operators) {
                        for (var _a = 0, _b = operator.operators; _a < _b.length; _a++) {
                            var op = _b[_a];
                            this.registerOperator(op, individual);
                        }
                    }
                };
                Application.prototype.newJSOperator = function (name, callback, isIndividual, fieldsDef) {
                    console.log(name);
                    return new Operator_4.JSOperator(name, callback, isIndividual, fieldsDef);
                };
                Application.prototype.listOperators = function () {
                    var local = [];
                    if (window && window['ops']) {
                        for (var op in window['ops']) {
                            local.push(op);
                        }
                    }
                    return local;
                };
                Application.prototype.describeOperator = function (name) {
                    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
                    var ARGUMENT_NAMES = /([^\s,]+)/g;
                    function getParamNames(func) {
                        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
                        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
                        if (result === null)
                            result = [];
                        return result;
                    }
                    var desc;
                    if (window && window['ops']) {
                        var operator = window['ops'][name];
                        if (!operator) {
                            Log_1.Log.error("Unable to find operator: " + name + ". Check if it has @Register as class decorator or use application.listOperators() to check the list of all operators");
                        }
                        else {
                            var funcStr = getParamNames(operator.func);
                            console.log("Constructor parameters: ", funcStr);
                            var instance = new operator.func();
                            for (var _i = 0, _a = instance.getFieldDefinition(); _i < _a.length; _i++) {
                                var field = _a[_i];
                                console.log(field.describe());
                            }
                        }
                    }
                    else {
                        Log_1.Log.error("Window object not found or no operators are registered");
                    }
                    return desc;
                };
                Application.prototype.createOperator = function (name, args) {
                    var op;
                    if (window && window['ops']) {
                        var operator = window['ops'][name];
                        if (!operator) {
                            Log_1.Log.error("Unable to find operator: " + name + ". Check if it has @Register as class decorator or use application.listOperators() to check the list of all operators");
                        }
                        else {
                            var inst = Object.create(operator.func.prototype);
                            operator.func.apply(inst, args);
                            op = inst;
                        }
                    }
                    else {
                        Log_1.Log.error("Window object not found or no operators are registered");
                    }
                    return op;
                };
                Application.prototype.initializeHud = function () {
                    new GuiHud_1.GuiHud(this, this.populationSize);
                };
                return Application;
            }());
            exports_22("Application", Application);
        }
    }
});
System.register("MiniHud", [], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    var MiniHud;
    return {
        setters:[],
        execute: function() {
            MiniHud = (function () {
                function MiniHud(application) {
                }
                return MiniHud;
            }());
            exports_23("MiniHud", MiniHud);
        }
    }
});
function Register(constructor) {
    if (window && window['ops'] === undefined) {
        window['ops'] = {};
    }
    var name = /function ([^(]*)/.exec(constructor + "")[1];
    window['ops'][name] = {
        name: name,
        func: constructor
    };
}
System.register("models/fields/CSSField", ["models/FieldDef", "Num"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var FieldDef_10, Num_9;
    var CSSField;
    return {
        setters:[
            function (FieldDef_10_1) {
                FieldDef_10 = FieldDef_10_1;
            },
            function (Num_9_1) {
                Num_9 = Num_9_1;
            }],
        execute: function() {
            /**
             * Fetch data
             *
             *
             //http://cssvalues.com/
             var cssValues = {};
             [].slice.call(
             document.getElementsByTagName('section')).forEach(
             (elem) => {
                    var id = elem.id;
                    var values = [];
                    cssValues[id] = values;
                    [].slice.call(elem.getElementsByTagName('code')).forEach((codeElem) => {
                        console.log(codeElem);
                        values.push(codeElem.innerText);
                    })
                }
             )
             console.log(JSON.stringify(cssValues));
             *
             */
            CSSField = (function (_super) {
                __extends(CSSField, _super);
                function CSSField(id, name) {
                    _super.call(this, name);
                    this.tags = CSSField.getTagsList(id);
                }
                CSSField.prototype.getInitialValue = function () {
                    var val = [], half = this.tags.length / 2;
                    for (var i = 0; i < half + Num_9.Num.randomInt(0, half); i++) {
                        val.push(CSSField.buildSingleCSS(this.tags, 5, 30));
                    }
                    return val;
                };
                CSSField.getFullCSSString = function (obj) {
                    var value = "";
                    obj.forEach(function (def) {
                        value += def.sel + "{";
                        def.def.forEach(function (props) {
                            value += props.property + ":" + props.value + ";";
                        });
                        value += "}";
                    });
                    return value;
                };
                CSSField.buildSingleCSS = function (selectors, minRules, maxRules) {
                    if (minRules === void 0) { minRules = 1; }
                    if (maxRules === void 0) { maxRules = 10; }
                    var css = {};
                    var selector = Num_9.Num.randomArrPicker(selectors);
                    css.sel = selector;
                    css.def = [];
                    for (var i = 0; i < Math.round(Math.random() * (maxRules - minRules)) + 1; i++) {
                        css.def.push(CSSField.getSingleCSSRule());
                    }
                    return css;
                };
                CSSField.getSingleCSSRule = function () {
                    var keys = Object.keys(CSSField.CSSOptions);
                    var cssRule = {};
                    var selectedKey = Num_9.Num.randomArrPicker(keys);
                    var tempValue = Num_9.Num.randomArrPicker(CSSField.CSSOptions[selectedKey]);
                    cssRule.property = selectedKey;
                    cssRule.value = CSSField.parseValue(tempValue);
                    return cssRule;
                };
                CSSField.getCSSValueForProp = function (prop) {
                    return CSSField.parseValue(CSSField.CSSOptions[prop]);
                };
                CSSField.parseValue = function (value) {
                    var final = "", isTag = false, lastIndex = 0;
                    for (var i = 0; i < value.length; i++) {
                        if (value[i] === "<" || value[i] === "[") {
                            lastIndex = i + 1;
                            isTag = true;
                        }
                        else if (value[i] === ">") {
                            isTag = false;
                            var tagName = value.substr(lastIndex, i - lastIndex);
                            switch (tagName) {
                                case "number":
                                    final += Num_9.Num.randomInt(0, 100);
                                    break;
                                case "percentage":
                                    final += Num_9.Num.randomInt(0, 100) + "%";
                                    break;
                                case "length":
                                case "integer":
                                    final += Num_9.Num.randomInt(-1028, 1028) + "px";
                                    break;
                                case "time":
                                    final += Num_9.Num.roundToPrecision(Num_9.Num.getRandomNum(0, 2), 2) + "s";
                                    break;
                                case "currentColor":
                                case 'color':
                                    final += "rgba("
                                        + Num_9.Num.randomInt(0, 255) + ","
                                        + Num_9.Num.randomInt(0, 255) + ","
                                        + Num_9.Num.randomInt(0, 255) + ","
                                        + Num_9.Num.roundToPrecision(Num_9.Num.getRandomNum(0, 1), 2) + ")";
                                    break;
                                default:
                                    console.log(tagName);
                            }
                        }
                        else if (value[i] === "]") {
                            isTag = false;
                            var tagName = value.substr(lastIndex, i - lastIndex);
                            //console.log(tagName);
                            var parse = Num_9.Num.randomArrPicker(CSSField.CSSOptions[tagName]);
                            //console.log(parse);
                            final += CSSField.parseValue(parse);
                        }
                        else if (!isTag) {
                            final += value[i];
                        }
                    }
                    return final;
                };
                CSSField.getTagsList = function (id) {
                    var tags = new Set([]);
                    this.iterateElement(document.getElementById(id), "#" + id, tags);
                    return Array.from(tags);
                };
                CSSField.iterateElement = function (element, ancestry, tags) {
                    var _this = this;
                    [].slice.call(element.children).forEach(function (elem) {
                        var tagName = elem.tagName.toLowerCase();
                        tags.add(ancestry + " " + tagName);
                        if (elem.classList.length > 0) {
                            [].slice.call(elem.classList).forEach(function (name) {
                                tags.add(ancestry + " " + tagName + "." + name);
                                tags.add(ancestry + " ." + name);
                            });
                        }
                        _this.iterateElement(elem, ancestry, tags);
                    });
                };
                CSSField.CSSOptions = {
                    "all": ["initial", "unset", "inherit"],
                    "animation": ["[animation-name] [animation-duration] [animation-timing-function] [animation-delay] [animation-iteration-count] [animation-direction] [animation-fill-mode] [animation-play-state]"],
                    "animation-delay": ["0s", "<time>", "@keyframes"],
                    "direction": ["ltr", "rtl"],
                    "animation-direction": ["normal", "reverse", "alternate-reverse", "alternate", "@keyframes"],
                    "animation-duration": ["0s", "<time>", "@keyframes"],
                    "animation-fill-mode": ["none", "forwards", "both", "backwards"],
                    "animation-iteration-count": ["1", "infinite", "<number>", "@keyframes"],
                    "animation-name": ["none", "@keyframes", "@keyframes"],
                    "animation-timing-function": ["ease", "steps(<integer>, start)", "steps(<integer>, end)", "step-start", "step-end", "linear", "ease-out", "ease-in-out", "ease-in", "cubic-bezier(<number>, <number>, <number>, <number>)", "@keyframes"],
                    "animation-play-state": ["running", "paused", "@keyframes"],
                    "visibility": ["visible", "hidden", "collapse"],
                    "backface-visibility": ["visible", "hidden"],
                    "background": ["[background-color] [background-repeat] [background-attachment] [background-position] / [background-size] [background-origin] [background-clip]", "background-size", "background-position", "background-origin", "background-clip", "background-origin", "background-origin", "background-clip"],
                    "background-attachment": ["scroll", "local", "fixed", "background-attachment"],
                    "background-blend-mode": ["normal", "soft-light", "screen", "saturation", "overlay", "multiply", "luminosity", "lighten", "hue", "hard-light", "exclusion", "difference", "darken", "color-dodge", "color-burn", "color"],
                    "color": ["<color>"],
                    "background-color": ["transparent", "<color>"],
                    "clip": ["auto", "rect(<length>, <length>, <length>, <length>)", "inset(<length>, <length>, <length>, <length>)", "clip-path"],
                    //"clip-path": ["none", "view-box", "stroke-box", "fill-box", "<url>", "<shape-box>", "<basic-shape>", "clip"],
                    "background-clip": ["border-box", "padding-box", "content-box", "background-clip"],
                    //"background-image": ["none", "url(\"path/file.png\")", "<repeating-gradient>", "<radial-gradient>", "<linear-gradient>", "<image-function>"],
                    "background-origin": ["padding-box", "content-box", "border-box", "background-attachment"],
                    "position": ["static", "sticky", "relative", "page", "fixed", "center", "absolute"],
                    "background-position": ["0% 0%", "right bottom", "left top", "center center", "<percentage> <length>", "background-position"],
                    "background-repeat": ["repeat", "space", "round", "repeat-y", "repeat-x", "repeat no-repeat", "no-repeat", "background-repeat"],
                    "background-size": ["auto", "cover", "contain", "auto <percentage>", "<percentage> <length>", "<percentage>", "<length> auto", "<length> <percentage>", "<length>"],
                    "order": ["0", "<integer>"],
                    "border": ["[border-width] [border-style] [border-color]", "border-image"],
                    "border-collapse": ["separate", "collapse"],
                    "border-color": ["<currentColor>", "transparent", "<color>"],
                    "top": ["auto", "<percentage>", "<length>"],
                    "border-top": ["[border-width] [border-style] [border-color]"],
                    "border-top-color": ["<currentColor>", "transparent", "<color>"],
                    "right": ["auto", "<percentage>", "<length>"],
                    "border-right": ["[border-width] [border-style] [border-color]"],
                    "border-right-color": ["<currentColor>", "transparent", "<color>"],
                    "bottom": ["auto", "<percentage>", "<length>"],
                    "border-bottom": ["[border-width] [border-style] [border-color]"],
                    "border-bottom-color": ["<currentColor>", "transparent", "<color>"],
                    "left": ["auto", "<percentage>", "<length>"],
                    "border-left": ["[border-width] [border-style] [border-color]"],
                    "border-left-color": ["<currentColor>", "transparent", "<color>"],
                    "border-radius": ["0", "<percentage>", "<length> <length> <length> <length>", "<length> / <percentage>", "<length>"],
                    "border-top-left-radius": ["0", "<percentage>", "<length>"],
                    "border-top-right-radius": ["0", "<percentage>", "<length>"],
                    "border-bottom-left-radius": ["0", "<percentage>", "<length>"],
                    "border-bottom-right-radius": ["0", "<percentage>", "<length>"],
                    //"border-image": ["[border-image-source] [border-image-slice] / [border-image-width] [border-image-width] / [border-image-outset] [border-image-repeat]"],
                    //"border-image-source": ["none", "url(\"path/file.png\")"],
                    "width": ["auto", "<percentage>", "<length>"],
                    "border-image-repeat": ["stretch", "space", "round", "repeat"],
                    "border-spacing": ["0", "<length> <length>", "<length>"],
                    "border-style": ["none", "solid", "ridge", "outset", "inset", "hidden", "groove", "double", "dotted", "dashed"],
                    "border-top-style": ["none", "solid", "ridge", "outset", "inset", "hidden", "groove", "double", "dotted", "dashed"],
                    "border-right-style": ["none", "solid", "ridge", "outset", "inset", "hidden", "groove", "double", "dotted", "dashed"],
                    "border-bottom-style": ["none", "solid", "ridge", "outset", "inset", "hidden", "groove", "double", "dotted", "dashed"],
                    "border-left-style": ["none", "solid", "ridge", "outset", "inset", "hidden", "groove", "double", "dotted", "dashed"],
                    "border-width": ["medium", "thin", "thick", "<length>"],
                    "border-top-width": ["medium", "thin", "thick", "<length>"],
                    "border-right-width": ["medium", "thin", "thick", "<length>"],
                    "border-bottom-width": ["medium", "thin", "thick", "<length>"],
                    "border-left-width": ["medium", "thin", "thick", "<length>"],
                    "box-decoration-break": ["slice", "clone"],
                    "box-shadow": ["none", "<length> <length> <length> <length> <color> inset"],
                    "box-sizing": ["content-box", "padding-box", "border-box", "padding-box"],
                    "break-before": ["auto", "right", "page", "left", "column", "avoid-page", "avoid-column", "avoid", "always"],
                    "break-after": ["auto", "right", "page", "left", "column", "avoid-page", "avoid-column", "avoid", "always"],
                    "break-inside": ["auto", "avoid-page", "avoid-column", "avoid"],
                    "caption-side": ["top", "bottom"],
                    "clear": ["none", "right", "left", "both"],
                    "clear-after": ["none", "top", "start", "right", "outside", "left", "inside", "end", "descendants", "bottom", "both"],
                    "column-fill": ["balance", "auto"],
                    "column-span": ["none", "all"],
                    "column-width": ["auto", "<length>"],
                    "column-count": ["auto", "<integer>"],
                    "column-gap": ["normal", "<length>"],
                    "column-rule": ["[column-rule-width] [column-rule-style] [column-rule-color]"],
                    "column-rule-color": ["<color>"],
                    "column-rule-style": ["none", "solid", "ridge", "outset", "inset", "hidden", "groove", "double", "dotted", "dashed"],
                    "column-rule-width": ["medium", "thin", "thick", "<length>"],
                    "columns": ["[column-width] [column-count]"],
                    "content": ["normal", "open-quote", "none", "no-open-quote", "no-close-quote", "icon", "close-quote", ":before", ":after"],
                    "counter-increment": ["none", "<integer>"],
                    "counter-reset": ["none", "<integer>"],
                    "cursor": ["auto", "zoom-out", "zoom-in", "wait", "w-resize", "vertical-text", "url(\"path/file.png\")", "text", "sw-resize", "se-resize", "s-resize", "row-resize", "progress", "pointer", "nwse-resize", "nw-resize", "ns-resize", "not-allowed", "none", "no-drop", "nesw-resize", "ne-resize", "n-resize", "move", "help", "ew-resize", "e-resize", "default", "crosshair", "copy", "context-menu", "col-resize", "cell", "all-scroll", "alias"],
                    "display": ["inline", "table-row-group", "table-row", "table-header-group", "table-footer-group", "table-column-group", "table-column", "table-cell", "table-caption", "table", "run-in", "run-in", "none", "list-item", "inline-table", "inline-flex", "inline-block", "flex", "container", "compact", "block"],
                    "empty-cells": ["show", "hide"],
                    "float": ["none", "right", "left"],
                    "flex": ["[flex-grow] [flex-shrink] [flex-basis]", "none"],
                    "flex-basis": ["auto", "<length>"],
                    "flex-direction": ["row", "row-reverse", "column-reverse", "column"],
                    "flex-flow": ["[flex-direction] [flex-wrap]"],
                    "flex-grow": ["0", "<number>"],
                    "flex-shrink": ["1", "<number>"],
                    "flex-wrap": ["nowrap", "wrap-reverse", "wrap"],
                    "align-items": ["stretch", "flex-start", "flex-end", "center", "baseline"],
                    "align-self": ["auto", "stretch", "flex-start", "flex-end", "center", "baseline"],
                    "align-content": ["stretch", "space-between", "space-around", "flex-start", "flex-end", "center"],
                    "justify-content": ["flex-start", "space-between", "space-around", "flex-end", "center"],
                    //"filter": ["none", "sepia(<number> | <percentage>)", "saturate(<number> | <percentage>)", "opacity(<number> | <percentage>)", "invert(<number> | <percentage>)", "hue-rotate(<angle>)", "grayscale(<number> | <percentage>)", "drop-shadow(<length> <color>)", "contrast(<number> | <percentage>)", "brightness(<number> | <percentage>)", "blur(<length>)", "<url>"],
                    "font": ["[font-style] [font-variant] [font-weight] [font-stretch] [font-size] / [line-height] "],
                    //"font-family": ["<family-name>"],
                    //"font-feature-settings": ["normal", "<feature-tag-value>"],
                    "font-size": ["medium", "xx-small", "xx-large", "x-small", "x-large", "smaller", "small", "larger", "large", "<percentage>", "<length>"],
                    "font-stretch": ["normal", "ultra-expanded", "ultra-condensed", "semi-expanded", "semi-condensed", "extra-expanded", "extra-condensed", "expanded", "condensed"],
                    "font-size-adjust": ["none", "<number>"],
                    "font-synthesis": ["weight style", "weight", "style", "none"],
                    "font-kerning": ["auto", "normal", "none"],
                    "font-variant": ["normal", "unicase", "titling-caps", "small-caps", "petite-caps", "all-small-caps", "all-petite-caps"],
                    "font-variant-caps": ["normal", "unicase", "titling-caps", "small-caps", "petite-caps", "all-small-caps", "all-petite-caps"],
                    "font-style": ["normal", "oblique", "italic"],
                    "font-weight": ["normal", "lighter", "bolder", "bold", "900", "800", "700", "600", "500", "400", "300", "200", "100"],
                    "hanging-punctuation": ["none", "last force-end", "last allow-end", "last", "force-end", "first force-end", "first allow-end", "first", "allow-end"],
                    "height": ["auto", "<percentage>", "<length>"],
                    "hyphens": ["manual", "none", "auto"],
                    "image-rendering": ["auto", "pixelated", "crisp-edges"],
                    "image-resolution": ["1dppx", "snap", "from-image"],
                    //"image-orientation": ["0deg", "from-image", "<angle> flip", "<angle>"],
                    "isolation": ["auto", "isolate"],
                    "letter-spacing": ["normal", "<length>"],
                    "line-break": ["auto", "strict", "normal", "loose"],
                    "line-height": ["normal", "<percentage>", "<number>", "<length>"],
                    "list-style": ["[list-style-type] [list-style-position]"],
                    //"list-style-image": ["none", "<url>"],
                    "list-style-position": ["outside", "inside"],
                    "list-style-type": ["disc", "upper-roman", "upper-latin", "upper-alpha", "square", "none", "lower-roman", "lower-latin", "lower-greek", "lower-alpha", "georgian", "decimal-leading-zero", "decimal", "circle", "armenian"],
                    "margin": ["[margin-top] [margin-right] [margin-bottom] [margin-left]"],
                    "margin-left": ["0", "auto", "<percentage>", "<length>"],
                    "margin-right": ["0", "auto", "<percentage>", "<length>"],
                    "margin-top": ["0", "auto", "<percentage>", "<length>"],
                    "margin-bottom": ["0", "auto", "<percentage>", "<length>"],
                    "mask-type": ["luminance", "alpha"],
                    "max-height": ["none", "<percentage>", "<length>"],
                    "max-width": ["none", "<percentage>", "<length>"],
                    "min-height": ["0", "auto", "<percentage>", "<length>"],
                    "min-width": ["0", "auto", "<percentage>", "<length>"],
                    "mix-blend-mode": ["normal", "soft-light", "screen", "saturation", "overlay", "multiply", "luminosity", "lighten", "hue", "hard-light", "exclusion", "difference", "darken", "color-dodge", "color-burn", "color"],
                    "object-fit": ["fill", "scale-down", "none", "cover", "contain"],
                    "object-position": ["50% 50%", "right bottom", "left top", "center center", "<percentage> <length>"],
                    "opacity": ["1", "<number>"],
                    "orphans": ["2", "<integer>"],
                    "outline": ["[outline-color] [outline-style] [outline-width]"],
                    "outline-color": ["invert", "<color>", "invert"],
                    "outline-offset": ["0", "<length>"],
                    "outline-style": ["none", "solid", "ridge", "outset", "inset", "groove", "double", "dotted", "dashed", "auto"],
                    "outline-width": ["medium", "thin", "thick", "<length>"],
                    "overflow": ["visible", "scroll", "hidden", "auto"],
                    "overflow-x": ["visible", "scroll", "hidden", "auto"],
                    "overflow-y": ["visible", "scroll", "hidden", "auto"],
                    "overflow-wrap": ["normal", "break-word", "word-wrap"],
                    "padding": ["[padding-top] [padding-right] [padding-bottom] [padding-left]"],
                    "padding-top": ["0", "<percentage>", "<length>"],
                    "padding-bottom": ["0", "<percentage>", "<length>"],
                    "padding-left": ["0", "<percentage>", "<length>"],
                    "padding-right": ["0", "<percentage>", "<length>"],
                    "page-break-after": ["auto", "right", "left", "avoid", "always"],
                    "page-break-before": ["auto", "right", "left", "avoid", "always"],
                    "page-break-inside": ["auto", "avoid"],
                    "perspective": ["none", "<length>"],
                    "perspective-origin": ["50% 50%", "top", "right", "left", "center", "bottom", "<percentage>", "<length>"],
                    "pointer-events": ["auto", "none"],
                    //"quotes": ["none", "<string> <string>", ":before", ":after"],
                    "resize": ["none", "vertical", "horizontal", "both"],
                    "scroll-behavior": ["auto", "smooth"],
                    "scroll-snap-coordinate": ["none", "right bottom", "margin-box", "left center", "border-box", "<percentage> <length>", "border-box", "margin-box"],
                    "scroll-snap-destination": ["0px 0px", "top bottom", "left right", "center center", "<length> <percentage>"],
                    "scroll-snap-type": ["none", "proximity", "mandatory"],
                    "tab-size": ["8", "<length>", "<integer>"],
                    "table-layout": ["auto", "fixed"],
                    "text-align": ["start end", "start", "right", "match-parent", "left", "justify", "end", "center"],
                    "text-align-last": ["auto", "start", "right", "left", "justify", "end", "center"],
                    "text-combine-upright": ["none", "digits <integer>", "all", "-webkit-text-combine"],
                    "text-decoration": ["[text-decoration-line] [text-decoration-style] [text-decoration-color]"],
                    "text-decoration-color": ["<currentColor>", "<color>"],
                    "text-decoration-line": ["none", "underline", "overline", "line-through", "blink"],
                    "text-decoration-skip": ["none", "spaces", "objects", "ink", "edges", "box-decoration"],
                    "text-decoration-style": ["solid", "wavy", "double", "dotted", "dashed"],
                    "text-emphasis": ["[text-emphasis-style] [text-emphasis-color]", "text-emphasis-position"],
                    "text-emphasis-style": ["none", "triangle", "sesame", "open", "filled", "double-circle", "dot", "circle"],
                    "text-emphasis-color": ["<currentColor>", "<color>"],
                    "text-emphasis-position": ["over right", "over left", "below right", "below left"],
                    "text-indent": ["0", "<percentage>", "<length> hanging each-line", "<length> hanging", "<length> each-line", "<length>"],
                    "text-justify": ["auto", "none", "inter-word", "distribute"],
                    "text-orientation": ["mixed", "use-glyph-orientation", "upright", "sideways-right", "sideways-left", "sideways"],
                    "text-overflow": ["clip", "ellipsis"],
                    "text-rendering": ["auto", "optimizeSpeed", "optimizeLegibility", "geometricPrecision"],
                    "text-shadow": ["none", "<length> <length> <length> <color>"],
                    "text-underline-position": ["auto", "under right", "under left", "under", "right", "left"],
                    "touch-action": ["auto", "pan-y", "pan-y", "pan-x", "pan-up", "pan-right", "pan-left", "pan-down", "none", "manipulation"],
                    //"transform": ["none", "translateZ(<length>)", "translateY(<translation-value>)", "translateX(<translation-value>)", "translate3d(<translation-value>, <translation-value>, <length>)", "translate(<translation-value>, <translation-value>)", "skewY(<angle>)", "skewX(<angle>)", "scaleZ(<number>)", "scaleY(<number>)", "scaleX(<number>)", "scale3d(<number>, <number>, <number>)", "scale(<number>)", "rotateZ(<angle>)", "rotateY(<angle>)", "rotateX(<angle>)", "rotate3d(<number>, <number>, <number>, <angle>)", "rotate(<angle>)", "perspective(<length>)", "matrix3d([16 comma-separated <number> values])", "matrix([<number>, <number>, <number>, <number>, <number>, <number>])"],
                    "transform-box": ["border-box", "view-box", "fill-box"],
                    "transform-origin": ["50% 50%", "top", "right", "left", "center", "bottom", "<percentage>", "<length>"],
                    "transform-style": ["flat", "preserve-3d"],
                    "text-transform": ["none", "uppercase", "lowercase", "full-width", "capitalize", "full-width"],
                    "transition": ["[transition-property] [transition-duration] [transition-timing-function] "],
                    "transition-property": ["all", "none"],
                    "transition-timing-function": ["ease", "steps(<integer>, start)", "steps(<integer>, end)", "steps(<integer>)", "step-start", "step-end", "linear", "ease-out", "ease-in-out", "ease-in", "cubic-bezier(<number>, <number>, <number>, <number>)"],
                    "transition-duration": ["0s", "<time>"],
                    "unicode-bidi": ["normal", "embed", "bidi-override"],
                    "vertical-align": ["baseline", "top", "text-top", "text-bottom", "super", "sub", "middle", "bottom", "<percentage>", "<length>"],
                    "white-space": ["normal", "pre-wrap", "pre-line", "pre", "nowrap", "pre-wrap", "pre-line"],
                    "widows": ["2", "<integer>"],
                    "will-change": ["auto", "scroll-position", "contents"],
                    "word-break": ["normal", "keep-all", "break-all"],
                    "word-spacing": ["normal", "<percentage>", "<length>"],
                    "word-wrap": ["normal", "break-word", "overflow-wrap"],
                    "writing-mode": ["horizontal-tb", "vertical-rl", "vertical-lr"],
                    "z-index": ["auto", "<integer>"],
                    "help": ["<length>", "inherit", "initial"]
                };
                return CSSField;
            }(FieldDef_10.FieldDef));
            exports_24("CSSField", CSSField);
        }
    }
});
System.register("models/fields/StrField", ["models/FieldDef", "Num"], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var FieldDef_11, Num_10;
    var StrField;
    return {
        setters:[
            function (FieldDef_11_1) {
                FieldDef_11 = FieldDef_11_1;
            },
            function (Num_10_1) {
                Num_10 = Num_10_1;
            }],
        execute: function() {
            StrField = (function (_super) {
                __extends(StrField, _super);
                function StrField(name, min, max) {
                    if (min === void 0) { min = 10; }
                    if (max === void 0) { max = 100; }
                    _super.call(this, name);
                    this.min = min;
                    this.max = max;
                }
                StrField.prototype.getInitialValue = function () {
                    var text = "";
                    for (var i = 0; i < Num_10.Num.getRandomNum(this.min, this.max); i++)
                        text += StrField.getRandomChar();
                    return text;
                };
                StrField.getRandomChar = function () {
                    return StrField.possible.charAt(Math.floor(Math.random() * this.possible.length));
                };
                StrField.possible = " ;:'\"!@#$%^&*()_+-=\\|,./<>?[]{}ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                return StrField;
            }(FieldDef_11.FieldDef));
            exports_25("StrField", StrField);
        }
    }
});
System.register("models/fields/JSCodeField", ["models/FieldDef", "Num", "models/fields/StrField"], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var FieldDef_12, Num_11, StrField_1;
    var JSCodeField;
    return {
        setters:[
            function (FieldDef_12_1) {
                FieldDef_12 = FieldDef_12_1;
            },
            function (Num_11_1) {
                Num_11 = Num_11_1;
            },
            function (StrField_1_1) {
                StrField_1 = StrField_1_1;
            }],
        execute: function() {
            JSCodeField = (function (_super) {
                __extends(JSCodeField, _super);
                function JSCodeField(name, min, max) {
                    if (min === void 0) { min = 10; }
                    if (max === void 0) { max = 100; }
                    _super.call(this, name, "");
                    this.keywords = ["abstract", "arguments", "boolean", "break", "byte", "case", "catch", "char", "class*", "const", "continue",
                        "debugger", "default", "delete", "do", "double", "else", "enum*", "eval",
                        "export*", "extends*", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import*",
                        "in", "instanceof", "int", "interface", "let", "long", "native", "new", "null", "package", "private",
                        "protected", "public", "return", "short", "static", "super*", "switch", "synchronized", "this", "throw", "throws", "transient",
                        "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield"];
                    this.possible = " ;:'\"!@#$%^&*()_+-=\\|,./<>?[]{}ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    this.assignment = ["+", "-", "*", "/", "%", "++", "--", "=", "=", "+=", "-=", "*=", "/=", "%="];
                    this.min = min;
                    this.max = max;
                }
                JSCodeField.prototype.getInitialValue = function () {
                    this.blocks = Num_11.Num.getRandomNum(this.min, this.max);
                    var result = "";
                    while (this.blocks > 0) {
                        result += this.getBlock();
                    }
                    return result;
                };
                JSCodeField.prototype.getBlock = function () {
                    var value = "";
                    this.blocks--;
                    if (this.blocks < 0)
                        return value;
                    var rand = Num_11.Num.randomInt(0, 3);
                    var str = this['case' + rand]();
                    value += str;
                    return value;
                };
                //assignment
                JSCodeField.prototype.case0 = function () {
                    return this.getBlock() + this.assignment[Num_11.Num.randomInt(0, this.assignment.length)] + this.getBlock();
                };
                //random
                JSCodeField.prototype.case1 = function () {
                    var num = Num_11.Num.randomInt(1, 10);
                    var str = "";
                    for (var i = 0; i < num; i++) {
                        str += StrField_1.StrField.getRandomChar();
                    }
                    return str;
                };
                //data-structure
                JSCodeField.prototype.case2 = function () {
                    var wrapperRand = Num_11.Num.randomInt(0, 2);
                    return wrapperRand === 0 ?
                        '[' + this.getBlock() + ']' :
                        wrapperRand === 1 ?
                            '{' + this.getBlock() + '}' :
                            wrapperRand === 2 ?
                                '(' + this.getBlock() + ')' :
                                '"' + this.getBlock() + '"';
                };
                //data-structure
                JSCodeField.prototype.case3 = function () {
                    return " " + this.keywords[Num_11.Num.randomInt(0, this.keywords.length - 1)] + " ";
                };
                return JSCodeField;
            }(FieldDef_12.FieldDef));
            exports_26("JSCodeField", JSCodeField);
        }
    }
});
System.register("operators/css/CSSDescriptor", ["models/IndividualOperator", "models/FieldDef", "models/fields/CSSField"], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    var IndividualOperator_3, FieldDef_13, CSSField_1;
    var CSSDescriptor;
    return {
        setters:[
            function (IndividualOperator_3_1) {
                IndividualOperator_3 = IndividualOperator_3_1;
            },
            function (FieldDef_13_1) {
                FieldDef_13 = FieldDef_13_1;
            },
            function (CSSField_1_1) {
                CSSField_1 = CSSField_1_1;
            }],
        execute: function() {
            CSSDescriptor = (function (_super) {
                __extends(CSSDescriptor, _super);
                function CSSDescriptor(id) {
                    _super.call(this, 'CSSDescriptor');
                    this.elementId = id;
                    this.styleElement = document.createElement('style');
                    this.styleElement.id = "cssstyle";
                    document.getElementsByTagName('head')[0].appendChild(this.styleElement);
                    this.htmlElement = document.getElementById(id);
                }
                CSSDescriptor.prototype.execute = function (ind) {
                    var _this = this;
                    if (ind.getValue('result') === undefined) {
                        var val = CSSField_1.CSSField.getFullCSSString(ind.getValue('css'));
                        this.styleElement.innerHTML = val;
                        var value = 0;
                        value += this.alignment(document, '.content > div', true);
                        value += this.noOverlapping(document, '.content > div');
                        value += this.noOffset(document, '.content > div');
                        value += this.fitInsideParent(document.getElementsByClassName('content')[0]);
                        [].slice.call(document.querySelectorAll('.content > div')).forEach(function (elem) {
                            value += _this.alignment(elem, '.elem', false);
                            value += _this.noOverlapping(elem, '.elem');
                        });
                        if (val.length === 0) {
                            value = 1e10;
                        }
                        else {
                            value += 1 - 1 / val.length;
                        }
                        ind.setValue("result", value);
                    }
                };
                CSSDescriptor.prototype.noOffset = function (root, query, increment) {
                    if (increment === void 0) { increment = 0.1; }
                    var value = 0;
                    [].slice.call(root.querySelectorAll(query)).forEach(function (elem) {
                        value += Math.abs(elem.offsetLeft);
                    });
                    return value;
                };
                CSSDescriptor.prototype.fitInsideParent = function (element) {
                    var value = 0;
                    var parent = element.parentElement, width = parent.offsetWidth, height = parent.offsetHeight, actualWidth = element.offsetWidth + element.offsetLeft, actualHeight = element.offsetHeight + element.offsetTop;
                    value += actualWidth > width ? actualWidth - width : 0;
                    value += actualHeight > height ? actualHeight - height : 0;
                    if (value > 0) {
                        value = 1 - (1 / value);
                    }
                    return value;
                };
                CSSDescriptor.prototype.noOverlapping = function (root, query, increment) {
                    if (increment === void 0) { increment = 0.1; }
                    var value = 0, arr = [].slice.call(root.querySelectorAll(query));
                    for (var i = 0; i < arr.length - 1; i++) {
                        for (var j = i + 1; j < arr.length; j++) {
                            var rect1 = arr[i].getBoundingClientRect();
                            var rect2 = arr[j].getBoundingClientRect();
                            var overlap = !(rect1.right < rect2.left ||
                                rect1.left > rect2.right ||
                                rect1.bottom < rect2.top ||
                                rect1.top > rect2.bottom);
                            if (overlap) {
                                value += increment;
                            }
                        }
                    }
                    return value;
                };
                CSSDescriptor.prototype.alignment = function (root, query, leftAlignment, increment) {
                    if (increment === void 0) { increment = 0.1; }
                    var value = 0;
                    var lastX = -1;
                    var lastY = -1;
                    [].slice.call(root.querySelectorAll(query)).forEach(function (elem) {
                        var clientRect = elem.getBoundingClientRect();
                        if (lastX == -1 && lastY == -1) {
                        }
                        else if (!leftAlignment && lastY !== clientRect.top) {
                            value += Math.abs(clientRect.top - lastY);
                        }
                        else if (leftAlignment && lastX !== clientRect.left) {
                            value += Math.abs(clientRect.left - lastX);
                        }
                        lastX = clientRect.left;
                        lastY = clientRect.top;
                    });
                    return value;
                };
                CSSDescriptor.prototype.getFieldDefinition = function () {
                    var css = new CSSField_1.CSSField(this.elementId, 'css');
                    var value = new FieldDef_13.OutputField("result");
                    return [css, value];
                };
                CSSDescriptor = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [String])
                ], CSSDescriptor);
                return CSSDescriptor;
            }(IndividualOperator_3.IndividualOperator));
            exports_27("CSSDescriptor", CSSDescriptor);
        }
    }
});
System.register("operators/css/CSSGAOperator", ["models/PopulationOperator", "Num", "models/fields/CSSField"], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var PopulationOperator_10, Num_12, CSSField_2;
    var CSSGAOperator;
    return {
        setters:[
            function (PopulationOperator_10_1) {
                PopulationOperator_10 = PopulationOperator_10_1;
            },
            function (Num_12_1) {
                Num_12 = Num_12_1;
            },
            function (CSSField_2_1) {
                CSSField_2 = CSSField_2_1;
            }],
        execute: function() {
            CSSGAOperator = (function (_super) {
                __extends(CSSGAOperator, _super);
                function CSSGAOperator(id, ruleAditionProbability, ruleRemovalProbability, propertyAlterProbability, propertyAdditionProbability, propertyRemovalProbability) {
                    if (ruleAditionProbability === void 0) { ruleAditionProbability = 0.6; }
                    if (ruleRemovalProbability === void 0) { ruleRemovalProbability = 0.02; }
                    if (propertyAlterProbability === void 0) { propertyAlterProbability = 0.4; }
                    if (propertyAdditionProbability === void 0) { propertyAdditionProbability = 0.4; }
                    if (propertyRemovalProbability === void 0) { propertyRemovalProbability = 0.5; }
                    _super.call(this, 'CSSGAOperator');
                    this.ruleAditionProbability = ruleAditionProbability;
                    this.ruleRemovalProbability = ruleRemovalProbability;
                    this.propertyAlterProbability = propertyAlterProbability;
                    this.propertyAdditionProbability = propertyAdditionProbability;
                    this.propertyRemovalProbability = propertyRemovalProbability;
                    this.tags = CSSField_2.CSSField.getTagsList(id);
                }
                CSSGAOperator.prototype.execute = function (population) {
                    var selection = population.cache['selection'];
                    var child1 = population.requestIndividual();
                    var child2 = population.requestIndividual();
                    var parent1 = selection[0];
                    var parent2 = selection[1];
                    var parent1CSSObject = parent1.getValue('css');
                    var parent2CSSObject = parent2.getValue('css');
                    var location = Num_12.Num.randomInt(1, Math.min(parent1CSSObject.length, parent2CSSObject.length) - 1);
                    if (location > 0) {
                        var end1 = parent1CSSObject.splice(location);
                        var end2 = parent2CSSObject.splice(location);
                        parent1CSSObject.concat(end2);
                        parent2CSSObject.concat(end1);
                    }
                    //console.log(CSSField.getFullCSSString(parent1CSSObject));
                    this.mutate(parent1CSSObject);
                    this.mutate(parent2CSSObject);
                    //console.log(CSSField.getFullCSSString(parent1CSSObject));
                    child1.setValue('css', parent1CSSObject);
                    child2.setValue('css', parent2CSSObject);
                    //console.log(parent1.getValue('css'));
                    //console.log(child1.getValue('css'));
                    //console.log("------");
                };
                CSSGAOperator.prototype.mutate = function (properties) {
                    try {
                        if (properties.length === 0 || Num_12.Num.getRandomNum() < this.ruleAditionProbability) {
                            properties.push(CSSField_2.CSSField.buildSingleCSS(this.tags));
                            return;
                        }
                        var selectedRule = Num_12.Num.randomInt(0, properties.length - 1);
                        var defs = properties[selectedRule].def;
                        var selectedProp = Num_12.Num.randomInt(0, defs.length - 1);
                        if (defs.length === 0 || Num_12.Num.getRandomNum() < this.ruleRemovalProbability && properties.length > 1) {
                            properties.splice(selectedRule, 1);
                        }
                        if (Num_12.Num.getRandomNum() < this.propertyAlterProbability) {
                            defs[selectedProp].value = CSSField_2.CSSField.getCSSValueForProp(defs[selectedProp].property);
                        }
                        if (Num_12.Num.getRandomNum() < this.propertyAdditionProbability) {
                            var rule = CSSField_2.CSSField.getSingleCSSRule();
                            var found;
                            for (var i = 0; i < defs.length; i++) {
                                if (defs[i].property === rule.property) {
                                    found = defs[i];
                                    break;
                                }
                            }
                            if (found) {
                                found.value = rule.value;
                            }
                            else {
                                defs.push(rule);
                            }
                        }
                        if (Num_12.Num.getRandomNum() < this.propertyRemovalProbability) {
                            defs.splice(selectedProp, 1);
                        }
                    }
                    catch (e) {
                        console.log(properties, defs, selectedRule, selectedProp);
                    }
                };
                CSSGAOperator.prototype.getCSSString = function (arr) {
                    var val = "";
                    arr.forEach(function (obj) {
                        val += obj.def + "{" + obj.val.join(";") + "}";
                    });
                    return val;
                };
                CSSGAOperator.prototype.getCSSArray = function (cssString) {
                    var cssObject = [];
                    var m;
                    var re = /(.*?){(.*?)}/gm;
                    while ((m = re.exec(cssString)) !== null) {
                        if (m.index === re.lastIndex) {
                            re.lastIndex++;
                        }
                        cssObject.push({ def: m[1].trim(), val: m[2].trim().split(";") });
                    }
                    return cssObject;
                };
                CSSGAOperator.prototype.getFieldDefinition = function () {
                    return undefined;
                };
                CSSGAOperator.prototype.hauptCrossover = function (value1, value2) {
                    if (_.isNumber(value1) && _.isNumber(value1)) {
                        var beta = Num_12.Num.getRandomNum();
                        return [beta * value1 + (1 - beta) * value2, (1 - beta) * value1 + beta * value2];
                    }
                    else {
                        return [value1, value2];
                    }
                };
                CSSGAOperator.prototype.hauptMutation = function (gmin, gmax) {
                    return gmin + Num_12.Num.getRandomNum() * (gmax - gmin);
                };
                CSSGAOperator = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [String, Number, Number, Number, Number, Number])
                ], CSSGAOperator);
                return CSSGAOperator;
            }(PopulationOperator_10.PopulationOperator));
            exports_28("CSSGAOperator", CSSGAOperator);
        }
    }
});
System.register("operators/css/CSSRenderer", ["models/PopulationOperator", "models/fields/CSSField"], function(exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    var PopulationOperator_11, CSSField_3;
    var CSSRenderer;
    return {
        setters:[
            function (PopulationOperator_11_1) {
                PopulationOperator_11 = PopulationOperator_11_1;
            },
            function (CSSField_3_1) {
                CSSField_3 = CSSField_3_1;
            }],
        execute: function() {
            CSSRenderer = (function (_super) {
                __extends(CSSRenderer, _super);
                function CSSRenderer() {
                    _super.call(this, 'CSSDescriptor');
                    this.styleElement = document.getElementById('cssstyle');
                }
                CSSRenderer.prototype.execute = function (pop) {
                    var ind = pop.individuals[0];
                    this.styleElement.innerHTML = CSSField_3.CSSField.getFullCSSString(ind.getValue('css'));
                };
                CSSRenderer.prototype.getFieldDefinition = function () {
                    return undefined;
                };
                CSSRenderer = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [])
                ], CSSRenderer);
                return CSSRenderer;
            }(PopulationOperator_11.PopulationOperator));
            exports_29("CSSRenderer", CSSRenderer);
        }
    }
});
System.register("operators/genetic/StringGA", ["models/fields/StrField", "Num", "models/PopulationOperator", "models/fields/JSCodeField"], function(exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
    var StrField_2, Num_13, PopulationOperator_12, JSCodeField_1;
    var StringGA;
    return {
        setters:[
            function (StrField_2_1) {
                StrField_2 = StrField_2_1;
            },
            function (Num_13_1) {
                Num_13 = Num_13_1;
            },
            function (PopulationOperator_12_1) {
                PopulationOperator_12 = PopulationOperator_12_1;
            },
            function (JSCodeField_1_1) {
                JSCodeField_1 = JSCodeField_1_1;
            }],
        execute: function() {
            StringGA = (function (_super) {
                __extends(StringGA, _super);
                function StringGA(field, crossoverChance, mutationChance) {
                    if (crossoverChance === void 0) { crossoverChance = 0.2; }
                    if (mutationChance === void 0) { mutationChance = 0.5; }
                    _super.call(this, 'StringGA');
                    this.field = field;
                    this.crossoverChance = crossoverChance;
                    this.mutationChance = mutationChance;
                }
                StringGA.prototype.execute = function (population) {
                    var selection = population.cache['selection'];
                    var parent1 = selection[0];
                    var parent2 = selection[1];
                    var valueParent1 = parent1.getValue(this.field);
                    var valueParent2 = parent2.getValue(this.field);
                    if (valueParent1 === valueParent2)
                        return;
                    var crossoverPoint = Num_13.Num.getRandomNum(0, Math.min(valueParent1.length, valueParent2.length), 0);
                    var crossoverValue1 = "";
                    var crossoverValue2 = "";
                    var oneToOne = true;
                    for (var i = 0; i < Math.max(valueParent1.length, valueParent2.length); i++) {
                        if (i < valueParent1.length && i < valueParent2.length && Num_13.Num.getRandomNum() < this.crossoverChance)
                            oneToOne = !oneToOne;
                        var vp1 = valueParent1.length <= i ? '' : valueParent1[i];
                        var vp2 = valueParent2.length <= i ? '' : valueParent2[i];
                        crossoverValue1 += oneToOne ? vp1 : vp2;
                        crossoverValue2 += oneToOne ? vp2 : vp1;
                    }
                    //var crossoverValue1 = valueParent1.substr(0, crossoverPoint) + valueParent2.substr(crossoverPoint, valueParent2.length - crossoverPoint);
                    //var crossoverValue2 = valueParent2.substr(0, crossoverPoint) + valueParent1.substr(crossoverPoint, valueParent1.length - crossoverPoint);
                    crossoverValue1 = this.mutate(crossoverValue1);
                    crossoverValue2 = this.mutate(crossoverValue2);
                    if (crossoverValue1.trim() !== "" && crossoverValue1 != valueParent1 && crossoverValue1 != valueParent2) {
                        var child1 = population.requestIndividual();
                        child1.setValue(this.field, crossoverValue1);
                    }
                    if (crossoverValue2.trim() !== "" && crossoverValue1 != valueParent1 && crossoverValue1 != valueParent2) {
                        var child2 = population.requestIndividual();
                        child2.setValue(this.field, crossoverValue2);
                    }
                };
                StringGA.prototype.mutate = function (str) {
                    var result = str;
                    if (Num_13.Num.getRandomNum() < this.mutationChance) {
                        var res = Num_13.Num.getRandomNum(0, 7, 0);
                        var position = Num_13.Num.getRandomNum(0, str.length, 0);
                        var remainingLength = str.length - position;
                        var randomLength = Num_13.Num.randomInt(0, str.length - position);
                        switch (res) {
                            //remove one char
                            case (0):
                                result = str.slice(0, position) + str.slice(position + 1);
                                break;
                            //add one char
                            case (1):
                                result = str.slice(0, position) + str.slice(position + 1);
                                break;
                            //prefix
                            case (2):
                                result = str.slice(0, position);
                                break;
                            //suffix
                            case (3):
                                result = str.slice(position);
                                break;
                            //within
                            case (4):
                                result = str.substr(position, remainingLength);
                                break;
                            case (5):
                                result = str.slice(0, position) + str.slice(position + randomLength);
                                break;
                            case (6):
                                result = str.slice(0, position) + StrField_2.StrField.getRandomChar() + str.slice(position);
                                break;
                            case (7):
                                result = str.slice(0, position) + new JSCodeField_1.JSCodeField("test").getBlock() + str.slice(position);
                                break;
                        }
                    }
                    return result;
                };
                StringGA.prototype.getFieldDefinition = function () {
                    return undefined;
                };
                StringGA = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [Object, Object, Object])
                ], StringGA);
                return StringGA;
            }(PopulationOperator_12.PopulationOperator));
            exports_30("StringGA", StringGA);
        }
    }
});
System.register("operators/misc/Sort", ["models/FieldDef", "models/PopulationOperator"], function(exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
    var FieldDef_14, PopulationOperator_13;
    var Sort;
    return {
        setters:[
            function (FieldDef_14_1) {
                FieldDef_14 = FieldDef_14_1;
            },
            function (PopulationOperator_13_1) {
                PopulationOperator_13 = PopulationOperator_13_1;
            }],
        execute: function() {
            Sort = (function (_super) {
                __extends(Sort, _super);
                function Sort(field, desc) {
                    if (desc === void 0) { desc = false; }
                    _super.call(this, "Sort");
                    this.field = field;
                    this.desc = desc;
                }
                Sort.prototype.execute = function (population) {
                    var _this = this;
                    population.individuals.sort(function (a, b) {
                        var value1 = a.getValue(_this.field);
                        var value2 = b.getValue(_this.field);
                        var val;
                        if (value1 === value2) {
                            val = 0;
                        }
                        else {
                            val = value1 > value2 ? -1 : 1;
                        }
                        return _this.desc ? val : -val;
                    });
                    for (var i = 0; i < population.individuals.length; i++) {
                        population.individuals[i].setValue(Sort.FIELD, i);
                    }
                };
                Sort.prototype.getFieldDefinition = function () {
                    return [new FieldDef_14.OutputField(Sort.FIELD, 0)];
                };
                Sort.FIELD = "sortOrder";
                Sort = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [String, Boolean])
                ], Sort);
                return Sort;
            }(PopulationOperator_13.PopulationOperator));
            exports_31("Sort", Sort);
        }
    }
});
System.register("operators/objective/Rastrigin", ["models/FieldDef", "models/IndividualOperator", "Num"], function(exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
    var FieldDef_15, FieldDef_16, IndividualOperator_4, Num_14;
    var Rastrigin;
    return {
        setters:[
            function (FieldDef_15_1) {
                FieldDef_15 = FieldDef_15_1;
                FieldDef_16 = FieldDef_15_1;
            },
            function (IndividualOperator_4_1) {
                IndividualOperator_4 = IndividualOperator_4_1;
            },
            function (Num_14_1) {
                Num_14 = Num_14_1;
            }],
        execute: function() {
            Rastrigin = (function (_super) {
                __extends(Rastrigin, _super);
                function Rastrigin() {
                    _super.call(this, 'Rastrigin');
                    this.X_FIELD_NAME = 'x';
                    this.Y_FIELD_NAME = 'y';
                }
                Rastrigin.prototype.execute = function (individual) {
                    var x = individual.getValue(this.X_FIELD_NAME);
                    var y = individual.getValue(this.Y_FIELD_NAME);
                    var sum = 0;
                    var obj = 20;
                    obj += x * x - (10 * Math.cos(2 * Math.PI * x));
                    obj += y * y - (10 * Math.cos(2 * Math.PI * y));
                    individual.setValue(Rastrigin.OBJ_FIELD_NAME, Num_14.Num.roundToPrecision(obj, Rastrigin.PRECISION));
                };
                Rastrigin.prototype.getName = function () {
                    return "Rastrigin";
                };
                Rastrigin.prototype.getFieldDefinition = function () {
                    var x = new FieldDef_16.NumericField(this.X_FIELD_NAME, -5.12, 5.12, Rastrigin.PRECISION);
                    var y = new FieldDef_16.NumericField(this.Y_FIELD_NAME, -5.12, 5.12, Rastrigin.PRECISION);
                    var value = new FieldDef_15.OutputField(Rastrigin.OBJ_FIELD_NAME);
                    return [x, y, value];
                };
                Rastrigin.OBJ_FIELD_NAME = 'rastrigin';
                Rastrigin.PRECISION = 10;
                Rastrigin = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [])
                ], Rastrigin);
                return Rastrigin;
            }(IndividualOperator_4.IndividualOperator));
            exports_32("Rastrigin", Rastrigin);
        }
    }
});
System.register("operators/objective/Weierstrass", ["models/FieldDef", "models/IndividualOperator", "Num"], function(exports_33, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
    var FieldDef_17, FieldDef_18, IndividualOperator_5, Num_15;
    var Weierstrass;
    return {
        setters:[
            function (FieldDef_17_1) {
                FieldDef_17 = FieldDef_17_1;
                FieldDef_18 = FieldDef_17_1;
            },
            function (IndividualOperator_5_1) {
                IndividualOperator_5 = IndividualOperator_5_1;
            },
            function (Num_15_1) {
                Num_15 = Num_15_1;
            }],
        execute: function() {
            Weierstrass = (function (_super) {
                __extends(Weierstrass, _super);
                function Weierstrass() {
                    _super.call(this, 'Weierstrass');
                    this.X_FIELD_NAME = 'x';
                    this.Y_FIELD_NAME = 'y';
                    this.a = 0.5;
                    this.b = 3.0;
                    this.kMax = 20;
                    var tmp = 0.0;
                    for (var k = 0; k <= this.kMax; k++) {
                        tmp += Math.pow(this.a, k) * Math.cos(2 * Math.PI * Math.pow(this.b, k) * 0.5);
                    }
                    this.constant = tmp;
                }
                Weierstrass.prototype.execute = function (individual) {
                    var x = individual.getValue(this.X_FIELD_NAME);
                    var y = individual.getValue(this.Y_FIELD_NAME);
                    var tmp = 0;
                    for (var k = 0; k <= this.kMax; k++) {
                        tmp += Math.pow(this.a, k) * Math.cos(2 * Math.PI * Math.pow(this.b, k) * (x + 0.5));
                    }
                    for (var k = 0; k <= this.kMax; k++) {
                        tmp += Math.pow(this.a, k) * Math.cos(2 * Math.PI * Math.pow(this.b, k) * (y + 0.5));
                    }
                    var value = tmp - 2 * this.constant;
                    individual.setValue(Weierstrass.OBJ_FIELD_NAME, Num_15.Num.roundToPrecision(value, Weierstrass.PRECISION));
                };
                Weierstrass.prototype.getName = function () {
                    return "Weierstrass";
                };
                Weierstrass.prototype.getFieldDefinition = function () {
                    var x = new FieldDef_18.NumericField(this.X_FIELD_NAME, 0, 2, Weierstrass.PRECISION);
                    var y = new FieldDef_18.NumericField(this.Y_FIELD_NAME, 0, 2, Weierstrass.PRECISION);
                    var value = new FieldDef_17.OutputField(Weierstrass.OBJ_FIELD_NAME);
                    return [x, y, value];
                };
                Weierstrass.OBJ_FIELD_NAME = 'weierstrass';
                Weierstrass.PRECISION = 6;
                Weierstrass = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [])
                ], Weierstrass);
                return Weierstrass;
            }(IndividualOperator_5.IndividualOperator));
            exports_33("Weierstrass", Weierstrass);
        }
    }
});
//# sourceMappingURL=bundle.js.map