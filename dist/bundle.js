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
                    if (!this.operators)
                        return;
                    for (var i = 0; i < this.numExecutions; i++) {
                        for (var _i = 0, _a = this.operators; _i < _a.length; _i++) {
                            var operator = _a[_i];
                            operator.doExecute(individual, population);
                        }
                    }
                };
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
                    for (var _i = 0, _a = population.individuals; _i < _a.length; _i++) {
                        var ind = _a[_i];
                        this.execute(ind);
                    }
                };
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
                    this.addButton(root, "Start", function () {
                        app.start();
                    });
                    this.addButton(root, "Tick", function () {
                        app.tick();
                    });
                    this.addButton(root, "Stop", function () {
                        app.stop();
                    });
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
                function GrimReaper(avgAge) {
                    _super.call(this, 'GrimReaper');
                    this.avgAge = avgAge || 100;
                }
                GrimReaper.prototype.execute = function (individual) {
                    var age = individual.getValue("age");
                    if (Num_3.Num.getRandomNum() < age / this.avgAge) {
                        this.getCurrentPopulation().removeIndividual(individual);
                    }
                };
                GrimReaper.prototype.getFieldDefinition = function () {
                    return [new FieldDef_5.OutputField("age", 1)];
                };
                GrimReaper = __decorate([
                    Register, 
                    __metadata('design:paramtypes', [Number])
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
                    population.rind = function () { that.requestIndividual(); };
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
System.register("operators/objective/Weierstrass", ["models/FieldDef", "models/IndividualOperator", "Num"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var FieldDef_10, FieldDef_11, IndividualOperator_3, Num_9;
    var Weierstrass;
    return {
        setters:[
            function (FieldDef_10_1) {
                FieldDef_10 = FieldDef_10_1;
                FieldDef_11 = FieldDef_10_1;
            },
            function (IndividualOperator_3_1) {
                IndividualOperator_3 = IndividualOperator_3_1;
            },
            function (Num_9_1) {
                Num_9 = Num_9_1;
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
                    individual.setValue(Weierstrass.OBJ_FIELD_NAME, Num_9.Num.roundToPrecision(value, Weierstrass.PRECISION));
                };
                Weierstrass.prototype.getName = function () {
                    return "Weierstrass";
                };
                Weierstrass.prototype.getFieldDefinition = function () {
                    var x = new FieldDef_11.NumericField(this.X_FIELD_NAME, 0, 2, Weierstrass.PRECISION);
                    var y = new FieldDef_11.NumericField(this.Y_FIELD_NAME, 0, 2, Weierstrass.PRECISION);
                    var value = new FieldDef_10.OutputField(Weierstrass.OBJ_FIELD_NAME);
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
            exports_24("Weierstrass", Weierstrass);
        }
    }
});
//# sourceMappingURL=bundle.js.map