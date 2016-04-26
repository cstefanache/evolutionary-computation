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
                function GuiHud(app) {
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
                    populationNumber.value = "100";
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
                function PSOA(fitness) {
                    _super.call(this, 'PSOA');
                    this.fitness = fitness;
                }
                PSOA.prototype.execute = function (population) {
                    //assuming that is already ranked
                    var best = population.individuals[0].getValue("PSOData");
                    var omega = 0.85;
                    var c1 = 0.1;
                    var c2 = 0.1;
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
                    __metadata('design:paramtypes', [String])
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
                function TableRenderer(maxRows) {
                    _super.call(this, "Table View");
                    this.maxRows = maxRows;
                    if (window) {
                        this.tableElement = $('<table class="table table-striped"></table>');
                        $(document.body).append(this.tableElement);
                    }
                }
                TableRenderer.prototype.execute = function (population) {
                    if (population.index === 0) {
                        var htmlContent = '<thead><tr><th>&nbsp</th>';
                        for (var _i = 0, _a = population.fields; _i < _a.length; _i++) {
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
                        htmlContent += '<tr><td style="background-color:' + population.color + '">&nbsp;</td>';
                        for (var _d = 0, _e = population.fields; _d < _e.length; _d++) {
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
                    __metadata('design:paramtypes', [Number])
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
                    new GuiHud_1.GuiHud(this);
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
System.register("models/fields/StrField", ["models/FieldDef", "Num"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var FieldDef_10, Num_9;
    var StrField;
    return {
        setters:[
            function (FieldDef_10_1) {
                FieldDef_10 = FieldDef_10_1;
            },
            function (Num_9_1) {
                Num_9 = Num_9_1;
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
                    for (var i = 0; i < Num_9.Num.getRandomNum(this.min, this.max); i++)
                        text += StrField.getRandomChar();
                    return text;
                };
                StrField.getRandomChar = function () {
                    return StrField.possible.charAt(Math.floor(Math.random() * this.possible.length));
                };
                StrField.possible = " ;:'\"!@#$%^&*()_+-=\\|,./<>?[]{}ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                return StrField;
            }(FieldDef_10.FieldDef));
            exports_24("StrField", StrField);
        }
    }
});
System.register("models/fields/JSCodeField", ["models/FieldDef", "Num", "models/fields/StrField"], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var FieldDef_11, Num_10, StrField_1;
    var JSCodeField;
    return {
        setters:[
            function (FieldDef_11_1) {
                FieldDef_11 = FieldDef_11_1;
            },
            function (Num_10_1) {
                Num_10 = Num_10_1;
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
                    this.blocks = Num_10.Num.getRandomNum(this.min, this.max);
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
                    var rand = Num_10.Num.randomInt(0, 3);
                    var str = this['case' + rand]();
                    value += str;
                    return value;
                };
                //assignment
                JSCodeField.prototype.case0 = function () {
                    return this.getBlock() + this.assignment[Num_10.Num.randomInt(0, this.assignment.length)] + this.getBlock();
                };
                //random
                JSCodeField.prototype.case1 = function () {
                    var num = Num_10.Num.randomInt(1, 10);
                    var str = "";
                    for (var i = 0; i < num; i++) {
                        str += StrField_1.StrField.getRandomChar();
                    }
                    return str;
                };
                //data-structure
                JSCodeField.prototype.case2 = function () {
                    var wrapperRand = Num_10.Num.randomInt(0, 2);
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
                    return " " + this.keywords[Num_10.Num.randomInt(0, this.keywords.length - 1)] + " ";
                };
                return JSCodeField;
            }(FieldDef_11.FieldDef));
            exports_25("JSCodeField", JSCodeField);
        }
    }
});
System.register("operators/genetic/StringGA", ["models/fields/StrField", "Num", "models/PopulationOperator", "models/fields/JSCodeField"], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var StrField_2, Num_11, PopulationOperator_10, JSCodeField_1;
    var StringGA;
    return {
        setters:[
            function (StrField_2_1) {
                StrField_2 = StrField_2_1;
            },
            function (Num_11_1) {
                Num_11 = Num_11_1;
            },
            function (PopulationOperator_10_1) {
                PopulationOperator_10 = PopulationOperator_10_1;
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
                    var crossoverPoint = Num_11.Num.getRandomNum(0, Math.min(valueParent1.length, valueParent2.length), 0);
                    var crossoverValue1 = "";
                    var crossoverValue2 = "";
                    var oneToOne = true;
                    for (var i = 0; i < Math.max(valueParent1.length, valueParent2.length); i++) {
                        if (i < valueParent1.length && i < valueParent2.length && Num_11.Num.getRandomNum() < this.crossoverChance)
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
                    if (Num_11.Num.getRandomNum() < this.mutationChance) {
                        var res = Num_11.Num.getRandomNum(0, 7, 0);
                        var position = Num_11.Num.getRandomNum(0, str.length, 0);
                        var remainingLength = str.length - position;
                        var randomLength = Num_11.Num.randomInt(0, str.length - position);
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
            }(PopulationOperator_10.PopulationOperator));
            exports_26("StringGA", StringGA);
        }
    }
});
System.register("operators/objective/Weierstrass", ["models/FieldDef", "models/IndividualOperator", "Num"], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    var FieldDef_12, FieldDef_13, IndividualOperator_3, Num_12;
    var Weierstrass;
    return {
        setters:[
            function (FieldDef_12_1) {
                FieldDef_12 = FieldDef_12_1;
                FieldDef_13 = FieldDef_12_1;
            },
            function (IndividualOperator_3_1) {
                IndividualOperator_3 = IndividualOperator_3_1;
            },
            function (Num_12_1) {
                Num_12 = Num_12_1;
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
                    individual.setValue(Weierstrass.OBJ_FIELD_NAME, Num_12.Num.roundToPrecision(value, Weierstrass.PRECISION));
                };
                Weierstrass.prototype.getName = function () {
                    return "Weierstrass";
                };
                Weierstrass.prototype.getFieldDefinition = function () {
                    var x = new FieldDef_13.NumericField(this.X_FIELD_NAME, 0, 2, Weierstrass.PRECISION);
                    var y = new FieldDef_13.NumericField(this.Y_FIELD_NAME, 0, 2, Weierstrass.PRECISION);
                    var value = new FieldDef_12.OutputField(Weierstrass.OBJ_FIELD_NAME);
                    return [x, y, value];
                };
                Weierstrass.OBJ_FIELD_NAME = 'weierstrass';
                Weierstrass.PRECISION = 6;
                Weierstrass = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [])
                ], Weierstrass);
                return Weierstrass;
            }(IndividualOperator_3.IndividualOperator));
            exports_27("Weierstrass", Weierstrass);
        }
    }
});
System.register("tests/ArrFunc", ["models/IndividualOperator", "models/fields/JSCodeField", "models/FieldDef"], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var IndividualOperator_4, JSCodeField_2, FieldDef_14;
    var ArrFunction;
    return {
        setters:[
            function (IndividualOperator_4_1) {
                IndividualOperator_4 = IndividualOperator_4_1;
            },
            function (JSCodeField_2_1) {
                JSCodeField_2 = JSCodeField_2_1;
            },
            function (FieldDef_14_1) {
                FieldDef_14 = FieldDef_14_1;
            }],
        execute: function() {
            ArrFunction = (function (_super) {
                __extends(ArrFunction, _super);
                function ArrFunction() {
                    _super.call(this, 'ArrFunction');
                    this.keywords = ["abstract", "arguments", "boolean", "break", "byte", "case", "catch", "char", "class*", "const", "continue",
                        "debugger", "default", "delete", "do", "double", "else", "enum*", "eval",
                        "export*", "extends*", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import*",
                        "in", "instanceof", "int", "interface", "let", "long", "native", "new", "null", "package", "private",
                        "protected", "public", "return", "short", "static", "super*", "switch", "synchronized", "this", "throw", "throws", "transient",
                        "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield"];
                    this.definitions = [/\\[.*\\]/, /\(.*\)/, /{.*}/];
                }
                ArrFunction.prototype.getFieldDefinition = function () {
                    return [new JSCodeField_2.JSCodeField('content', 2, 6), new FieldDef_14.OutputField('obj', -1)];
                };
                ArrFunction.prototype.execute = function (individual) {
                    var obj = individual.getValue('obj');
                    if (obj !== -1) {
                        return;
                    }
                    var func = individual.getValue('content');
                    var value = 0;
                    try {
                        var res = eval(func);
                        if (!Array.isArray(res)) {
                            value += 1e5;
                        }
                        else {
                            value = 100;
                            var last = res[0];
                            if (_.isNumber(last) && last < 10) {
                                value--;
                            }
                            for (var i = 1; i < res.length; i++) {
                                var val = res[i];
                                if (_.isNumber(val)) {
                                    value -= res[i] > last ? (res[i] - last === 1 ? -4 : -2) : -1;
                                }
                                else {
                                    value += 2;
                                }
                                last = res[i];
                            }
                        }
                    }
                    catch (err) {
                        value += 1e6 - func.length;
                        for (var key in this.keywords) {
                            if (func.indexOf(key) !== -1) {
                                value--;
                            }
                        }
                        for (var i_1 = 0; i_1 < this.definitions.length; i_1++) {
                            if (func.match(this.definitions[i_1])) {
                                value--;
                            }
                        }
                    }
                    individual.setValue('obj', value);
                };
                return ArrFunction;
            }(IndividualOperator_4.IndividualOperator));
            exports_28("ArrFunction", ArrFunction);
        }
    }
});
///<reference path="../models/FieldDef.ts"/>
System.register("tests/SumFunction", ["models/IndividualOperator", "models/fields/StrField", "models/FieldDef"], function(exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    var IndividualOperator_5, StrField_3, FieldDef_15;
    var SumFunction;
    return {
        setters:[
            function (IndividualOperator_5_1) {
                IndividualOperator_5 = IndividualOperator_5_1;
            },
            function (StrField_3_1) {
                StrField_3 = StrField_3_1;
            },
            function (FieldDef_15_1) {
                FieldDef_15 = FieldDef_15_1;
            }],
        execute: function() {
            SumFunction = (function (_super) {
                __extends(SumFunction, _super);
                function SumFunction() {
                    _super.call(this, 'SumFunctionOperator');
                }
                SumFunction.prototype.getFieldDefinition = function () {
                    return [new StrField_3.StrField('content', 1, 10), new FieldDef_15.OutputField('obj')];
                };
                SumFunction.prototype.execute = function (individual) {
                    var func = individual.getValue('content');
                    var value = 0;
                    var x = 3;
                    var y = 4;
                    var parameters = ['x', 'y'];
                    try {
                        //var timestamp = new Date().getTime();
                        var result = eval(func);
                        value = Math.abs(result - 7);
                    }
                    catch (err) {
                        value += 1e3 - result.length;
                    }
                    for (var _i = 0, parameters_1 = parameters; _i < parameters_1.length; _i++) {
                        var param = parameters_1[_i];
                        if (func.indexOf(param) === -1) {
                            value += 50;
                        }
                    }
                    individual.setValue('obj', value);
                };
                return SumFunction;
            }(IndividualOperator_5.IndividualOperator));
            exports_29("SumFunction", SumFunction);
        }
    }
});
System.register("tests/Test", ["Application", "Num", "tests/ArrFunc", "operators/ranking/LinearRanking", "operators/renderers/TableRenderer", "models/GroupOperator", "operators/selection/Roulette", "operators/genetic/StringGA", "operators/misc/PopulationSizeControl"], function(exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
    var Application_1, Num_13, ArrFunc_1, LinearRanking_1, TableRenderer_1, GroupOperator_2, Roulette_1, StringGA_1, PopulationSizeControl_1;
    var application, groupOperator;
    return {
        setters:[
            function (Application_1_1) {
                Application_1 = Application_1_1;
            },
            function (Num_13_1) {
                Num_13 = Num_13_1;
            },
            function (ArrFunc_1_1) {
                ArrFunc_1 = ArrFunc_1_1;
            },
            function (LinearRanking_1_1) {
                LinearRanking_1 = LinearRanking_1_1;
            },
            function (TableRenderer_1_1) {
                TableRenderer_1 = TableRenderer_1_1;
            },
            function (GroupOperator_2_1) {
                GroupOperator_2 = GroupOperator_2_1;
            },
            function (Roulette_1_1) {
                Roulette_1 = Roulette_1_1;
            },
            function (StringGA_1_1) {
                StringGA_1 = StringGA_1_1;
            },
            function (PopulationSizeControl_1_1) {
                PopulationSizeControl_1 = PopulationSizeControl_1_1;
            }],
        execute: function() {
            application = new Application_1.Application(); // Initialize population
            if (window) {
                window['application'] = application; // Make them available on browser console
                window['num'] = Num_13.Num; // Also random number generator
            }
            application.addPopulation(500); // Add a population of 30 individuals
            application.addOperator(new ArrFunc_1.ArrFunction()); // Add Schwefel optimisation problem
            application.addOperator(new LinearRanking_1.LinearRanking('obj'));
            application.addOperator(new TableRenderer_1.TableRenderer(10));
            groupOperator = new GroupOperator_2.GroupOperator("Group Operator", 50);
            groupOperator.addOperator(new Roulette_1.Roulette('linearRanking'));
            groupOperator.addOperator(new StringGA_1.StringGA('content', 0.1, 0.2));
            application.addOperator(groupOperator);
            application.addOperator(new PopulationSizeControl_1.PopulationSizeControl(500));
            application.initializeHud(); //Initialize the Mini-HUD for easier algorithm interactions (start/stop/reset)
            application.tick();
        }
    }
});
//# sourceMappingURL=bundle.js.map