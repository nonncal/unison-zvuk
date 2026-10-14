import runtime0 from 'ajv/dist/runtime/ucs2length.js'
"use strict";
export const validateCommand = validate52;
const schema19 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$defs":{"ClockProbe":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"default":null,"title":"Expectedplaybackrevision","type":"null"},"type":{"const":"clock.probe","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ProbePayload"}},"required":["v","requestId","type","payload"],"title":"ClockProbe","type":"object"},"EmptyPayload":{"additionalProperties":false,"properties":{},"title":"EmptyPayload","type":"object"},"HeartbeatPong":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"default":null,"title":"Expectedplaybackrevision","type":"null"},"type":{"const":"heartbeat.pong","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/PingPayload"}},"required":["v","requestId","type","payload"],"title":"HeartbeatPong","type":"object"},"ParticipantReadiness":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"default":null,"title":"Expectedplaybackrevision","type":"null"},"type":{"const":"participant.readiness","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/Readiness"}},"required":["v","requestId","type","payload"],"title":"ParticipantReadiness","type":"object"},"Pause":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Expectedplaybackrevision","type":"integer"},"type":{"const":"playback.pause","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/EmptyPayload"}},"required":["v","requestId","expectedPlaybackRevision","type","payload"],"title":"Pause","type":"object"},"PingPayload":{"additionalProperties":false,"properties":{"pingId":{"format":"uuid","title":"Pingid","type":"string"}},"required":["pingId"],"title":"PingPayload","type":"object"},"Play":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Expectedplaybackrevision","type":"integer"},"type":{"const":"playback.play","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/PlayPayload"}},"required":["v","requestId","expectedPlaybackRevision","type","payload"],"title":"Play","type":"object"},"PlayPayload":{"additionalProperties":false,"properties":{"allowNotReady":{"default":false,"title":"Allownotready","type":"boolean"}},"title":"PlayPayload","type":"object"},"ProbePayload":{"additionalProperties":false,"properties":{"clientSentAtMs":{"maximum":9007199254740991,"minimum":0,"title":"Clientsentatms","type":"integer"},"probeId":{"format":"uuid","title":"Probeid","type":"string"}},"required":["clientSentAtMs","probeId"],"title":"ProbePayload","type":"object"},"Readiness":{"additionalProperties":false,"properties":{"trackId":{"format":"uuid","title":"Trackid","type":"string"},"mediaVersion":{"maxLength":128,"minLength":1,"title":"Mediaversion","type":"string"},"state":{"enum":["loading","ready","buffering","autoplayBlocked","error"],"title":"State","type":"string"},"bufferedAheadMs":{"maximum":900000,"minimum":0,"title":"Bufferedaheadms","type":"integer"},"autoplayAllowed":{"title":"Autoplayallowed","type":"boolean"}},"required":["trackId","mediaVersion","state","bufferedAheadMs","autoplayAllowed"],"title":"Readiness","type":"object"},"Seek":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Expectedplaybackrevision","type":"integer"},"type":{"const":"playback.seek","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/SeekPayload"}},"required":["v","requestId","expectedPlaybackRevision","type","payload"],"title":"Seek","type":"object"},"SeekPayload":{"additionalProperties":false,"properties":{"positionMs":{"maximum":900000,"minimum":0,"title":"Positionms","type":"integer"}},"required":["positionMs"],"title":"SeekPayload","type":"object"},"SelectPayload":{"additionalProperties":false,"properties":{"trackId":{"format":"uuid","title":"Trackid","type":"string"}},"required":["trackId"],"title":"SelectPayload","type":"object"},"SelectTrack":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Expectedplaybackrevision","type":"integer"},"type":{"const":"playback.select","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/SelectPayload"}},"required":["v","requestId","expectedPlaybackRevision","type","payload"],"title":"SelectTrack","type":"object"},"SnapshotRequest":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"default":null,"title":"Expectedplaybackrevision","type":"null"},"type":{"const":"room.snapshot.request","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/EmptyPayload"}},"required":["v","requestId","type","payload"],"title":"SnapshotRequest","type":"object"},"Telemetry":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"default":null,"title":"Expectedplaybackrevision","type":"null"},"type":{"const":"sync.telemetry","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/TelemetryPayload"}},"required":["v","requestId","type","payload"],"title":"Telemetry","type":"object"},"TelemetryPayload":{"additionalProperties":false,"properties":{"trackId":{"format":"uuid","title":"Trackid","type":"string"},"mediaVersion":{"maxLength":128,"minLength":1,"title":"Mediaversion","type":"string"},"driftMs":{"maximum":900000,"minimum":-900000,"title":"Driftms","type":"integer"},"rttMs":{"maximum":60000,"minimum":0,"title":"Rttms","type":"integer"},"localState":{"enum":["playing","paused","buffering","autoplayBlocked","error"],"title":"Localstate","type":"string"}},"required":["trackId","mediaVersion","driftMs","rttMs","localState"],"title":"TelemetryPayload","type":"object"}},"oneOf":[{"$ref":"#/$defs/ClockProbe"},{"$ref":"#/$defs/HeartbeatPong"},{"$ref":"#/$defs/SnapshotRequest"},{"$ref":"#/$defs/ParticipantReadiness"},{"$ref":"#/$defs/SelectTrack"},{"$ref":"#/$defs/Play"},{"$ref":"#/$defs/Pause"},{"$ref":"#/$defs/Seek"},{"$ref":"#/$defs/Telemetry"}],"$id":"urn:unison:client-command-v1","title":"ClientCommand"};
const schema20 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"default":null,"title":"Expectedplaybackrevision","type":"null"},"type":{"const":"clock.probe","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ProbePayload"}},"required":["v","requestId","type","payload"],"title":"ClockProbe","type":"object"};
const formats0 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const schema21 = {"additionalProperties":false,"properties":{"clientSentAtMs":{"maximum":9007199254740991,"minimum":0,"title":"Clientsentatms","type":"integer"},"probeId":{"format":"uuid","title":"Probeid","type":"string"}},"required":["clientSentAtMs","probeId"],"title":"ProbePayload","type":"object"};

function validate54(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate54.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.clientSentAtMs === undefined) && (missing0 = "clientSentAtMs")) || ((data.probeId === undefined) && (missing0 = "probeId"))){
validate54.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "clientSentAtMs") || (key0 === "probeId"))){
validate54.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.clientSentAtMs !== undefined){
let data0 = data.clientSentAtMs;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate54.errors = [{instancePath:instancePath+"/clientSentAtMs",schemaPath:"#/properties/clientSentAtMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs2){
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 > 9007199254740991 || isNaN(data0)){
validate54.errors = [{instancePath:instancePath+"/clientSentAtMs",schemaPath:"#/properties/clientSentAtMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data0 < 0 || isNaN(data0)){
validate54.errors = [{instancePath:instancePath+"/clientSentAtMs",schemaPath:"#/properties/clientSentAtMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.probeId !== undefined){
let data1 = data.probeId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate54.errors = [{instancePath:instancePath+"/probeId",schemaPath:"#/properties/probeId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate54.errors = [{instancePath:instancePath+"/probeId",schemaPath:"#/properties/probeId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate54.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate54.errors = vErrors;
return errors === 0;
}
validate54.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate53(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate53.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.v === undefined) && (missing0 = "v")) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate53.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "v") || (key0 === "requestId")) || (key0 === "expectedPlaybackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate53.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate53.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate53.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data1 = data.requestId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate53.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate53.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expectedPlaybackRevision !== undefined){
const _errs6 = errors;
if(data.expectedPlaybackRevision !== null){
validate53.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/type",keyword:"type",params:{type: "null"},message:"must be null"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data3 = data.type;
const _errs8 = errors;
if(typeof data3 !== "string"){
validate53.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("clock.probe" !== data3){
validate53.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "clock.probe"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs10 = errors;
if(!(validate54(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate54.errors : vErrors.concat(validate54.errors);
errors = vErrors.length;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate53.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate53.errors = vErrors;
return errors === 0;
}
validate53.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema22 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"default":null,"title":"Expectedplaybackrevision","type":"null"},"type":{"const":"heartbeat.pong","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/PingPayload"}},"required":["v","requestId","type","payload"],"title":"HeartbeatPong","type":"object"};
const schema23 = {"additionalProperties":false,"properties":{"pingId":{"format":"uuid","title":"Pingid","type":"string"}},"required":["pingId"],"title":"PingPayload","type":"object"};

function validate58(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate58.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.pingId === undefined) && (missing0 = "pingId")){
validate58.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "pingId")){
validate58.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.pingId !== undefined){
let data0 = data.pingId;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate58.errors = [{instancePath:instancePath+"/pingId",schemaPath:"#/properties/pingId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate58.errors = [{instancePath:instancePath+"/pingId",schemaPath:"#/properties/pingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
}
}
}
}
else {
validate58.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate58.errors = vErrors;
return errors === 0;
}
validate58.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate57(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate57.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.v === undefined) && (missing0 = "v")) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate57.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "v") || (key0 === "requestId")) || (key0 === "expectedPlaybackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate57.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate57.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate57.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data1 = data.requestId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate57.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate57.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expectedPlaybackRevision !== undefined){
const _errs6 = errors;
if(data.expectedPlaybackRevision !== null){
validate57.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/type",keyword:"type",params:{type: "null"},message:"must be null"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data3 = data.type;
const _errs8 = errors;
if(typeof data3 !== "string"){
validate57.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("heartbeat.pong" !== data3){
validate57.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "heartbeat.pong"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs10 = errors;
if(!(validate58(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate58.errors : vErrors.concat(validate58.errors);
errors = vErrors.length;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate57.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate57.errors = vErrors;
return errors === 0;
}
validate57.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema24 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"default":null,"title":"Expectedplaybackrevision","type":"null"},"type":{"const":"room.snapshot.request","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/EmptyPayload"}},"required":["v","requestId","type","payload"],"title":"SnapshotRequest","type":"object"};
const schema25 = {"additionalProperties":false,"properties":{},"title":"EmptyPayload","type":"object"};

function validate62(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate62.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
for(const key0 in data){
validate62.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
else {
validate62.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate62.errors = vErrors;
return errors === 0;
}
validate62.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate61(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate61.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.v === undefined) && (missing0 = "v")) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate61.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "v") || (key0 === "requestId")) || (key0 === "expectedPlaybackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate61.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate61.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate61.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data1 = data.requestId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate61.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate61.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expectedPlaybackRevision !== undefined){
const _errs6 = errors;
if(data.expectedPlaybackRevision !== null){
validate61.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/type",keyword:"type",params:{type: "null"},message:"must be null"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data3 = data.type;
const _errs8 = errors;
if(typeof data3 !== "string"){
validate61.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("room.snapshot.request" !== data3){
validate61.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "room.snapshot.request"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs10 = errors;
if(!(validate62(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate62.errors : vErrors.concat(validate62.errors);
errors = vErrors.length;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate61.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate61.errors = vErrors;
return errors === 0;
}
validate61.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema26 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"default":null,"title":"Expectedplaybackrevision","type":"null"},"type":{"const":"participant.readiness","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/Readiness"}},"required":["v","requestId","type","payload"],"title":"ParticipantReadiness","type":"object"};
const schema27 = {"additionalProperties":false,"properties":{"trackId":{"format":"uuid","title":"Trackid","type":"string"},"mediaVersion":{"maxLength":128,"minLength":1,"title":"Mediaversion","type":"string"},"state":{"enum":["loading","ready","buffering","autoplayBlocked","error"],"title":"State","type":"string"},"bufferedAheadMs":{"maximum":900000,"minimum":0,"title":"Bufferedaheadms","type":"integer"},"autoplayAllowed":{"title":"Autoplayallowed","type":"boolean"}},"required":["trackId","mediaVersion","state","bufferedAheadMs","autoplayAllowed"],"title":"Readiness","type":"object"};
const func1 = runtime0.default;

function validate66(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate66.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.trackId === undefined) && (missing0 = "trackId")) || ((data.mediaVersion === undefined) && (missing0 = "mediaVersion"))) || ((data.state === undefined) && (missing0 = "state"))) || ((data.bufferedAheadMs === undefined) && (missing0 = "bufferedAheadMs"))) || ((data.autoplayAllowed === undefined) && (missing0 = "autoplayAllowed"))){
validate66.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "trackId") || (key0 === "mediaVersion")) || (key0 === "state")) || (key0 === "bufferedAheadMs")) || (key0 === "autoplayAllowed"))){
validate66.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.trackId !== undefined){
let data0 = data.trackId;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate66.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate66.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mediaVersion !== undefined){
let data1 = data.mediaVersion;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(func1(data1) > 128){
validate66.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/maxLength",keyword:"maxLength",params:{limit: 128},message:"must NOT have more than 128 characters"}];
return false;
}
else {
if(func1(data1) < 1){
validate66.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate66.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.state !== undefined){
let data2 = data.state;
const _errs6 = errors;
if(typeof data2 !== "string"){
validate66.errors = [{instancePath:instancePath+"/state",schemaPath:"#/properties/state/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((((data2 === "loading") || (data2 === "ready")) || (data2 === "buffering")) || (data2 === "autoplayBlocked")) || (data2 === "error"))){
validate66.errors = [{instancePath:instancePath+"/state",schemaPath:"#/properties/state/enum",keyword:"enum",params:{allowedValues: schema27.properties.state.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.bufferedAheadMs !== undefined){
let data3 = data.bufferedAheadMs;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate66.errors = [{instancePath:instancePath+"/bufferedAheadMs",schemaPath:"#/properties/bufferedAheadMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 900000 || isNaN(data3)){
validate66.errors = [{instancePath:instancePath+"/bufferedAheadMs",schemaPath:"#/properties/bufferedAheadMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate66.errors = [{instancePath:instancePath+"/bufferedAheadMs",schemaPath:"#/properties/bufferedAheadMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.autoplayAllowed !== undefined){
const _errs10 = errors;
if(typeof data.autoplayAllowed !== "boolean"){
validate66.errors = [{instancePath:instancePath+"/autoplayAllowed",schemaPath:"#/properties/autoplayAllowed/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate66.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate66.errors = vErrors;
return errors === 0;
}
validate66.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate65(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate65.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.v === undefined) && (missing0 = "v")) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate65.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "v") || (key0 === "requestId")) || (key0 === "expectedPlaybackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate65.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate65.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate65.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data1 = data.requestId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate65.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate65.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expectedPlaybackRevision !== undefined){
const _errs6 = errors;
if(data.expectedPlaybackRevision !== null){
validate65.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/type",keyword:"type",params:{type: "null"},message:"must be null"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data3 = data.type;
const _errs8 = errors;
if(typeof data3 !== "string"){
validate65.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("participant.readiness" !== data3){
validate65.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "participant.readiness"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs10 = errors;
if(!(validate66(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate66.errors : vErrors.concat(validate66.errors);
errors = vErrors.length;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate65.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate65.errors = vErrors;
return errors === 0;
}
validate65.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema28 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Expectedplaybackrevision","type":"integer"},"type":{"const":"playback.select","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/SelectPayload"}},"required":["v","requestId","expectedPlaybackRevision","type","payload"],"title":"SelectTrack","type":"object"};
const schema29 = {"additionalProperties":false,"properties":{"trackId":{"format":"uuid","title":"Trackid","type":"string"}},"required":["trackId"],"title":"SelectPayload","type":"object"};

function validate70(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate70.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.trackId === undefined) && (missing0 = "trackId")){
validate70.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "trackId")){
validate70.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.trackId !== undefined){
let data0 = data.trackId;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate70.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate70.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
}
}
}
}
else {
validate70.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate70.errors = vErrors;
return errors === 0;
}
validate70.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate69(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate69.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.v === undefined) && (missing0 = "v")) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.expectedPlaybackRevision === undefined) && (missing0 = "expectedPlaybackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate69.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "v") || (key0 === "requestId")) || (key0 === "expectedPlaybackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate69.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate69.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate69.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data1 = data.requestId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate69.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate69.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expectedPlaybackRevision !== undefined){
let data2 = data.expectedPlaybackRevision;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate69.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate69.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate69.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data3 = data.type;
const _errs8 = errors;
if(typeof data3 !== "string"){
validate69.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("playback.select" !== data3){
validate69.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "playback.select"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs10 = errors;
if(!(validate70(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate70.errors : vErrors.concat(validate70.errors);
errors = vErrors.length;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate69.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate69.errors = vErrors;
return errors === 0;
}
validate69.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema30 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Expectedplaybackrevision","type":"integer"},"type":{"const":"playback.play","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/PlayPayload"}},"required":["v","requestId","expectedPlaybackRevision","type","payload"],"title":"Play","type":"object"};
const schema31 = {"additionalProperties":false,"properties":{"allowNotReady":{"default":false,"title":"Allownotready","type":"boolean"}},"title":"PlayPayload","type":"object"};

function validate74(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate74.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "allowNotReady")){
validate74.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.allowNotReady !== undefined){
if(typeof data.allowNotReady !== "boolean"){
validate74.errors = [{instancePath:instancePath+"/allowNotReady",schemaPath:"#/properties/allowNotReady/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
}
}
else {
validate74.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate74.errors = vErrors;
return errors === 0;
}
validate74.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate73(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate73.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.v === undefined) && (missing0 = "v")) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.expectedPlaybackRevision === undefined) && (missing0 = "expectedPlaybackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate73.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "v") || (key0 === "requestId")) || (key0 === "expectedPlaybackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate73.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate73.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate73.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data1 = data.requestId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate73.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate73.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expectedPlaybackRevision !== undefined){
let data2 = data.expectedPlaybackRevision;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate73.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate73.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate73.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data3 = data.type;
const _errs8 = errors;
if(typeof data3 !== "string"){
validate73.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("playback.play" !== data3){
validate73.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "playback.play"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs10 = errors;
if(!(validate74(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate74.errors : vErrors.concat(validate74.errors);
errors = vErrors.length;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate73.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate73.errors = vErrors;
return errors === 0;
}
validate73.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema32 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Expectedplaybackrevision","type":"integer"},"type":{"const":"playback.pause","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/EmptyPayload"}},"required":["v","requestId","expectedPlaybackRevision","type","payload"],"title":"Pause","type":"object"};

function validate77(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate77.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.v === undefined) && (missing0 = "v")) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.expectedPlaybackRevision === undefined) && (missing0 = "expectedPlaybackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate77.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "v") || (key0 === "requestId")) || (key0 === "expectedPlaybackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate77.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate77.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate77.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data1 = data.requestId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate77.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate77.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expectedPlaybackRevision !== undefined){
let data2 = data.expectedPlaybackRevision;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate77.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate77.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate77.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data3 = data.type;
const _errs8 = errors;
if(typeof data3 !== "string"){
validate77.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("playback.pause" !== data3){
validate77.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "playback.pause"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs10 = errors;
if(!(validate62(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate62.errors : vErrors.concat(validate62.errors);
errors = vErrors.length;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate77.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate77.errors = vErrors;
return errors === 0;
}
validate77.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema33 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Expectedplaybackrevision","type":"integer"},"type":{"const":"playback.seek","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/SeekPayload"}},"required":["v","requestId","expectedPlaybackRevision","type","payload"],"title":"Seek","type":"object"};
const schema34 = {"additionalProperties":false,"properties":{"positionMs":{"maximum":900000,"minimum":0,"title":"Positionms","type":"integer"}},"required":["positionMs"],"title":"SeekPayload","type":"object"};

function validate81(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate81.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.positionMs === undefined) && (missing0 = "positionMs")){
validate81.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "positionMs")){
validate81.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.positionMs !== undefined){
let data0 = data.positionMs;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate81.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs2){
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 > 900000 || isNaN(data0)){
validate81.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data0 < 0 || isNaN(data0)){
validate81.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
}
}
}
}
else {
validate81.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate81.errors = vErrors;
return errors === 0;
}
validate81.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate80(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate80.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.v === undefined) && (missing0 = "v")) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.expectedPlaybackRevision === undefined) && (missing0 = "expectedPlaybackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate80.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "v") || (key0 === "requestId")) || (key0 === "expectedPlaybackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate80.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate80.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate80.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data1 = data.requestId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate80.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate80.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expectedPlaybackRevision !== undefined){
let data2 = data.expectedPlaybackRevision;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate80.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate80.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate80.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data3 = data.type;
const _errs8 = errors;
if(typeof data3 !== "string"){
validate80.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("playback.seek" !== data3){
validate80.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "playback.seek"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs10 = errors;
if(!(validate81(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate81.errors : vErrors.concat(validate81.errors);
errors = vErrors.length;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate80.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate80.errors = vErrors;
return errors === 0;
}
validate80.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema35 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"default":null,"title":"Expectedplaybackrevision","type":"null"},"type":{"const":"sync.telemetry","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/TelemetryPayload"}},"required":["v","requestId","type","payload"],"title":"Telemetry","type":"object"};
const schema36 = {"additionalProperties":false,"properties":{"trackId":{"format":"uuid","title":"Trackid","type":"string"},"mediaVersion":{"maxLength":128,"minLength":1,"title":"Mediaversion","type":"string"},"driftMs":{"maximum":900000,"minimum":-900000,"title":"Driftms","type":"integer"},"rttMs":{"maximum":60000,"minimum":0,"title":"Rttms","type":"integer"},"localState":{"enum":["playing","paused","buffering","autoplayBlocked","error"],"title":"Localstate","type":"string"}},"required":["trackId","mediaVersion","driftMs","rttMs","localState"],"title":"TelemetryPayload","type":"object"};

function validate85(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate85.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.trackId === undefined) && (missing0 = "trackId")) || ((data.mediaVersion === undefined) && (missing0 = "mediaVersion"))) || ((data.driftMs === undefined) && (missing0 = "driftMs"))) || ((data.rttMs === undefined) && (missing0 = "rttMs"))) || ((data.localState === undefined) && (missing0 = "localState"))){
validate85.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "trackId") || (key0 === "mediaVersion")) || (key0 === "driftMs")) || (key0 === "rttMs")) || (key0 === "localState"))){
validate85.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.trackId !== undefined){
let data0 = data.trackId;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate85.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate85.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mediaVersion !== undefined){
let data1 = data.mediaVersion;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(func1(data1) > 128){
validate85.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/maxLength",keyword:"maxLength",params:{limit: 128},message:"must NOT have more than 128 characters"}];
return false;
}
else {
if(func1(data1) < 1){
validate85.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate85.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.driftMs !== undefined){
let data2 = data.driftMs;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate85.errors = [{instancePath:instancePath+"/driftMs",schemaPath:"#/properties/driftMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 900000 || isNaN(data2)){
validate85.errors = [{instancePath:instancePath+"/driftMs",schemaPath:"#/properties/driftMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data2 < -900000 || isNaN(data2)){
validate85.errors = [{instancePath:instancePath+"/driftMs",schemaPath:"#/properties/driftMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: -900000},message:"must be >= -900000"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.rttMs !== undefined){
let data3 = data.rttMs;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate85.errors = [{instancePath:instancePath+"/rttMs",schemaPath:"#/properties/rttMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 60000 || isNaN(data3)){
validate85.errors = [{instancePath:instancePath+"/rttMs",schemaPath:"#/properties/rttMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 60000},message:"must be <= 60000"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate85.errors = [{instancePath:instancePath+"/rttMs",schemaPath:"#/properties/rttMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.localState !== undefined){
let data4 = data.localState;
const _errs10 = errors;
if(typeof data4 !== "string"){
validate85.errors = [{instancePath:instancePath+"/localState",schemaPath:"#/properties/localState/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((((data4 === "playing") || (data4 === "paused")) || (data4 === "buffering")) || (data4 === "autoplayBlocked")) || (data4 === "error"))){
validate85.errors = [{instancePath:instancePath+"/localState",schemaPath:"#/properties/localState/enum",keyword:"enum",params:{allowedValues: schema36.properties.localState.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate85.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate85.errors = vErrors;
return errors === 0;
}
validate85.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate84(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate84.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.v === undefined) && (missing0 = "v")) || ((data.requestId === undefined) && (missing0 = "requestId"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate84.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "v") || (key0 === "requestId")) || (key0 === "expectedPlaybackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate84.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate84.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate84.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data1 = data.requestId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate84.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate84.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expectedPlaybackRevision !== undefined){
const _errs6 = errors;
if(data.expectedPlaybackRevision !== null){
validate84.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/type",keyword:"type",params:{type: "null"},message:"must be null"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data3 = data.type;
const _errs8 = errors;
if(typeof data3 !== "string"){
validate84.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("sync.telemetry" !== data3){
validate84.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "sync.telemetry"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs10 = errors;
if(!(validate85(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate85.errors : vErrors.concat(validate85.errors);
errors = vErrors.length;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate84.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate84.errors = vErrors;
return errors === 0;
}
validate84.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate52(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="urn:unison:client-command-v1" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate52.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
let valid0 = false;
let passing0 = null;
const _errs1 = errors;
if(!(validate53(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate53.errors : vErrors.concat(validate53.errors);
errors = vErrors.length;
}
var _valid0 = _errs1 === errors;
if(_valid0){
valid0 = true;
passing0 = 0;
var props0 = true;
}
const _errs2 = errors;
if(!(validate57(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate57.errors : vErrors.concat(validate57.errors);
errors = vErrors.length;
}
var _valid0 = _errs2 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid0 = true;
passing0 = 1;
if(props0 !== true){
props0 = true;
}
}
const _errs3 = errors;
if(!(validate61(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate61.errors : vErrors.concat(validate61.errors);
errors = vErrors.length;
}
var _valid0 = _errs3 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 2];
}
else {
if(_valid0){
valid0 = true;
passing0 = 2;
if(props0 !== true){
props0 = true;
}
}
const _errs4 = errors;
if(!(validate65(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate65.errors : vErrors.concat(validate65.errors);
errors = vErrors.length;
}
var _valid0 = _errs4 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 3];
}
else {
if(_valid0){
valid0 = true;
passing0 = 3;
if(props0 !== true){
props0 = true;
}
}
const _errs5 = errors;
if(!(validate69(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
errors = vErrors.length;
}
var _valid0 = _errs5 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 4];
}
else {
if(_valid0){
valid0 = true;
passing0 = 4;
if(props0 !== true){
props0 = true;
}
}
const _errs6 = errors;
if(!(validate73(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate73.errors : vErrors.concat(validate73.errors);
errors = vErrors.length;
}
var _valid0 = _errs6 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 5];
}
else {
if(_valid0){
valid0 = true;
passing0 = 5;
if(props0 !== true){
props0 = true;
}
}
const _errs7 = errors;
if(!(validate77(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate77.errors : vErrors.concat(validate77.errors);
errors = vErrors.length;
}
var _valid0 = _errs7 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 6];
}
else {
if(_valid0){
valid0 = true;
passing0 = 6;
if(props0 !== true){
props0 = true;
}
}
const _errs8 = errors;
if(!(validate80(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate80.errors : vErrors.concat(validate80.errors);
errors = vErrors.length;
}
var _valid0 = _errs8 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 7];
}
else {
if(_valid0){
valid0 = true;
passing0 = 7;
if(props0 !== true){
props0 = true;
}
}
const _errs9 = errors;
if(!(validate84(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate84.errors : vErrors.concat(validate84.errors);
errors = vErrors.length;
}
var _valid0 = _errs9 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 8];
}
else {
if(_valid0){
valid0 = true;
passing0 = 8;
if(props0 !== true){
props0 = true;
}
}
}
}
}
}
}
}
}
}
if(!valid0){
const err0 = {instancePath,schemaPath:"#/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
validate52.errors = vErrors;
return false;
}
else {
errors = _errs0;
if(vErrors !== null){
if(_errs0){
vErrors.length = _errs0;
}
else {
vErrors = null;
}
}
}
validate52.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate52.evaluated = {"dynamicProps":true,"dynamicItems":false};

export const validateEvent = validate88;
const schema37 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$defs":{"AckPayload":{"additionalProperties":false,"properties":{"requestId":{"format":"uuid","title":"Requestid","type":"string"},"acceptedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Acceptedplaybackrevision","type":"integer"},"effectiveAtServerTimeMs":{"anyOf":[{"maximum":9007199254740991,"minimum":0,"type":"integer"},{"type":"null"}],"default":null,"title":"Effectiveatservertimems"}},"required":["requestId","acceptedPlaybackRevision"],"title":"AckPayload","type":"object"},"ClockReply":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"clock.reply","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ClockReplyPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"ClockReply","type":"object"},"ClockReplyPayload":{"additionalProperties":false,"properties":{"clientSentAtMs":{"maximum":9007199254740991,"minimum":0,"title":"Clientsentatms","type":"integer"},"probeId":{"format":"uuid","title":"Probeid","type":"string"},"serverReceivedAtMs":{"maximum":9007199254740991,"minimum":0,"title":"Serverreceivedatms","type":"integer"},"serverSentAtMs":{"maximum":9007199254740991,"minimum":0,"title":"Serversentatms","type":"integer"}},"required":["clientSentAtMs","probeId","serverReceivedAtMs","serverSentAtMs"],"title":"ClockReplyPayload","type":"object"},"ClosedPayload":{"additionalProperties":false,"properties":{"reason":{"enum":["closedByHost","expired","emptyTimeout"],"title":"Reason","type":"string"}},"required":["reason"],"title":"ClosedPayload","type":"object"},"CommandAck":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"command.ack","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/AckPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"CommandAck","type":"object"},"CommandError":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"command.error","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ErrorPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"CommandError","type":"object"},"ErrorPayload":{"additionalProperties":false,"properties":{"requestId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Requestid"},"code":{"title":"Code","type":"string"},"message":{"title":"Message","type":"string"},"snapshot":{"anyOf":[{"$ref":"#/$defs/Snapshot"},{"type":"null"}],"default":null}},"required":["requestId","code","message"],"title":"ErrorPayload","type":"object"},"HeartbeatPing":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"heartbeat.ping","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/PingPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"HeartbeatPing","type":"object"},"Hello":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"hello","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/HelloPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"Hello","type":"object"},"HelloPayload":{"additionalProperties":false,"properties":{"connectionId":{"format":"uuid","title":"Connectionid","type":"string"},"epoch":{"format":"uuid","title":"Epoch","type":"string"},"protocolVersion":{"const":1,"default":1,"title":"Protocolversion","type":"integer"},"snapshot":{"$ref":"#/$defs/Snapshot"}},"required":["connectionId","epoch","snapshot"],"title":"HelloPayload","type":"object"},"HostChanged":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"host.changed","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/HostPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"HostChanged","type":"object"},"HostPayload":{"additionalProperties":false,"properties":{"participantId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Participantid"}},"required":["participantId"],"title":"HostPayload","type":"object"},"Participant":{"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"displayName":{"title":"Displayname","type":"string"},"role":{"enum":["host","listener"],"title":"Role","type":"string"},"connectionState":{"enum":["online","offline","connecting"],"title":"Connectionstate","type":"string"},"readiness":{"anyOf":[{"$ref":"#/$defs/Readiness"},{"type":"null"}]}},"required":["id","displayName","role","connectionState","readiness"],"title":"Participant","type":"object"},"PendingTransition":{"additionalProperties":false,"properties":{"type":{"enum":["play","pause","seek"],"title":"Type","type":"string"},"nextStatus":{"enum":["paused","playing","ended"],"title":"Nextstatus","type":"string"},"positionMs":{"maximum":900000,"minimum":0,"title":"Positionms","type":"integer"},"effectiveAtServerTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Effectiveatservertimems","type":"integer"},"trackId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"default":null,"title":"Trackid"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Mediaversion"}},"required":["type","nextStatus","positionMs","effectiveAtServerTimeMs"],"title":"PendingTransition","type":"object"},"PingPayload":{"additionalProperties":false,"properties":{"pingId":{"format":"uuid","title":"Pingid","type":"string"}},"required":["pingId"],"title":"PingPayload","type":"object"},"Playback":{"additionalProperties":false,"properties":{"roomId":{"format":"uuid","title":"Roomid","type":"string"},"epoch":{"format":"uuid","title":"Epoch","type":"string"},"trackId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Trackid"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Mediaversion"},"status":{"enum":["empty","paused","playing","ended"],"title":"Status","type":"string"},"positionMs":{"maximum":900000,"minimum":0,"title":"Positionms","type":"integer"},"anchorServerTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Anchorservertimems","type":"integer"},"durationMs":{"maximum":900000,"minimum":0,"title":"Durationms","type":"integer"},"pendingTransition":{"anyOf":[{"$ref":"#/$defs/PendingTransition"},{"type":"null"}]}},"required":["roomId","epoch","trackId","mediaVersion","status","positionMs","anchorServerTimeMs","durationMs","pendingTransition"],"title":"Playback","type":"object"},"PlaybackState":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"playback.state","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/Playback"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"PlaybackState","type":"object"},"PresenceChanged":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"presence.changed","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/PresencePayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"PresenceChanged","type":"object"},"PresencePayload":{"additionalProperties":false,"properties":{"presenceSeq":{"maximum":9007199254740991,"minimum":0,"title":"Presenceseq","type":"integer"},"participants":{"items":{"$ref":"#/$defs/Participant"},"title":"Participants","type":"array"}},"required":["presenceSeq","participants"],"title":"PresencePayload","type":"object"},"Readiness":{"additionalProperties":false,"properties":{"trackId":{"format":"uuid","title":"Trackid","type":"string"},"mediaVersion":{"maxLength":128,"minLength":1,"title":"Mediaversion","type":"string"},"state":{"enum":["loading","ready","buffering","autoplayBlocked","error"],"title":"State","type":"string"},"bufferedAheadMs":{"maximum":900000,"minimum":0,"title":"Bufferedaheadms","type":"integer"},"autoplayAllowed":{"title":"Autoplayallowed","type":"boolean"}},"required":["trackId","mediaVersion","state","bufferedAheadMs","autoplayAllowed"],"title":"Readiness","type":"object"},"Room":{"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"title":{"title":"Title","type":"string"},"status":{"enum":["active","closed","expired"],"title":"Status","type":"string"},"capacity":{"maximum":10,"minimum":2,"title":"Capacity","type":"integer"},"expiresAt":{"maximum":9007199254740991,"minimum":0,"title":"Expiresat","type":"integer"},"hostParticipantId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Hostparticipantid"}},"required":["id","title","status","capacity","expiresAt","hostParticipantId"],"title":"Room","type":"object"},"RoomClosed":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"room.closed","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ClosedPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"RoomClosed","type":"object"},"RoomSnapshot":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"room.snapshot","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/Snapshot"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"RoomSnapshot","type":"object"},"Snapshot":{"additionalProperties":false,"properties":{"room":{"$ref":"#/$defs/Room"},"participants":{"items":{"$ref":"#/$defs/Participant"},"title":"Participants","type":"array"},"playback":{"$ref":"#/$defs/Playback"},"presenceSeq":{"maximum":9007199254740991,"minimum":0,"title":"Presenceseq","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"}},"required":["room","participants","playback","presenceSeq","playbackRevision"],"title":"Snapshot","type":"object"},"Track":{"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"title":{"title":"Title","type":"string"},"artist":{"title":"Artist","type":"string"},"durationMs":{"anyOf":[{"maximum":900000,"minimum":0,"type":"integer"},{"type":"null"}],"title":"Durationms"},"status":{"enum":["uploading","processing","ready","failed"],"title":"Status","type":"string"},"errorCode":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Errorcode"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Mediaversion"},"coverUrl":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Coverurl"},"sourceUri":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Sourceuri"},"licenseId":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Licenseid"},"licenseUri":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Licenseuri"}},"required":["id","title","artist","durationMs","status"],"title":"Track","type":"object"},"TrackPayload":{"additionalProperties":false,"properties":{"track":{"$ref":"#/$defs/Track"}},"required":["track"],"title":"TrackPayload","type":"object"},"TrackUpdated":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"track.updated","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/TrackPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"TrackUpdated","type":"object"}},"oneOf":[{"$ref":"#/$defs/Hello"},{"$ref":"#/$defs/RoomSnapshot"},{"$ref":"#/$defs/PlaybackState"},{"$ref":"#/$defs/ClockReply"},{"$ref":"#/$defs/HeartbeatPing"},{"$ref":"#/$defs/PresenceChanged"},{"$ref":"#/$defs/HostChanged"},{"$ref":"#/$defs/TrackUpdated"},{"$ref":"#/$defs/RoomClosed"},{"$ref":"#/$defs/CommandAck"},{"$ref":"#/$defs/CommandError"}],"$id":"urn:unison:server-event-v1","title":"ServerEvent"};
const schema38 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"hello","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/HelloPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"Hello","type":"object"};
const schema39 = {"additionalProperties":false,"properties":{"connectionId":{"format":"uuid","title":"Connectionid","type":"string"},"epoch":{"format":"uuid","title":"Epoch","type":"string"},"protocolVersion":{"const":1,"default":1,"title":"Protocolversion","type":"integer"},"snapshot":{"$ref":"#/$defs/Snapshot"}},"required":["connectionId","epoch","snapshot"],"title":"HelloPayload","type":"object"};
const schema40 = {"additionalProperties":false,"properties":{"room":{"$ref":"#/$defs/Room"},"participants":{"items":{"$ref":"#/$defs/Participant"},"title":"Participants","type":"array"},"playback":{"$ref":"#/$defs/Playback"},"presenceSeq":{"maximum":9007199254740991,"minimum":0,"title":"Presenceseq","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"}},"required":["room","participants","playback","presenceSeq","playbackRevision"],"title":"Snapshot","type":"object"};
const schema41 = {"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"title":{"title":"Title","type":"string"},"status":{"enum":["active","closed","expired"],"title":"Status","type":"string"},"capacity":{"maximum":10,"minimum":2,"title":"Capacity","type":"integer"},"expiresAt":{"maximum":9007199254740991,"minimum":0,"title":"Expiresat","type":"integer"},"hostParticipantId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Hostparticipantid"}},"required":["id","title","status","capacity","expiresAt","hostParticipantId"],"title":"Room","type":"object"};

function validate92(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate92.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.id === undefined) && (missing0 = "id")) || ((data.title === undefined) && (missing0 = "title"))) || ((data.status === undefined) && (missing0 = "status"))) || ((data.capacity === undefined) && (missing0 = "capacity"))) || ((data.expiresAt === undefined) && (missing0 = "expiresAt"))) || ((data.hostParticipantId === undefined) && (missing0 = "hostParticipantId"))){
validate92.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "id") || (key0 === "title")) || (key0 === "status")) || (key0 === "capacity")) || (key0 === "expiresAt")) || (key0 === "hostParticipantId"))){
validate92.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate92.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate92.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.title !== undefined){
const _errs4 = errors;
if(typeof data.title !== "string"){
validate92.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
let data2 = data.status;
const _errs6 = errors;
if(typeof data2 !== "string"){
validate92.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data2 === "active") || (data2 === "closed")) || (data2 === "expired"))){
validate92.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema41.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.capacity !== undefined){
let data3 = data.capacity;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate92.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 10 || isNaN(data3)){
validate92.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10},message:"must be <= 10"}];
return false;
}
else {
if(data3 < 2 || isNaN(data3)){
validate92.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 2},message:"must be >= 2"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expiresAt !== undefined){
let data4 = data.expiresAt;
const _errs10 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate92.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs10){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate92.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 0 || isNaN(data4)){
validate92.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.hostParticipantId !== undefined){
let data5 = data.hostParticipantId;
const _errs12 = errors;
const _errs13 = errors;
let valid1 = false;
const _errs14 = errors;
if(errors === _errs14){
if(errors === _errs14){
if(typeof data5 === "string"){
if(!(formats0.test(data5))){
const err0 = {instancePath:instancePath+"/hostParticipantId",schemaPath:"#/properties/hostParticipantId/anyOf/0/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
else {
const err1 = {instancePath:instancePath+"/hostParticipantId",schemaPath:"#/properties/hostParticipantId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
var _valid0 = _errs14 === errors;
valid1 = valid1 || _valid0;
const _errs16 = errors;
if(data5 !== null){
const err2 = {instancePath:instancePath+"/hostParticipantId",schemaPath:"#/properties/hostParticipantId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs16 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err3 = {instancePath:instancePath+"/hostParticipantId",schemaPath:"#/properties/hostParticipantId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
validate92.errors = vErrors;
return false;
}
else {
errors = _errs13;
if(vErrors !== null){
if(_errs13){
vErrors.length = _errs13;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate92.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate92.errors = vErrors;
return errors === 0;
}
validate92.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema42 = {"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"displayName":{"title":"Displayname","type":"string"},"role":{"enum":["host","listener"],"title":"Role","type":"string"},"connectionState":{"enum":["online","offline","connecting"],"title":"Connectionstate","type":"string"},"readiness":{"anyOf":[{"$ref":"#/$defs/Readiness"},{"type":"null"}]}},"required":["id","displayName","role","connectionState","readiness"],"title":"Participant","type":"object"};
const schema43 = {"additionalProperties":false,"properties":{"trackId":{"format":"uuid","title":"Trackid","type":"string"},"mediaVersion":{"maxLength":128,"minLength":1,"title":"Mediaversion","type":"string"},"state":{"enum":["loading","ready","buffering","autoplayBlocked","error"],"title":"State","type":"string"},"bufferedAheadMs":{"maximum":900000,"minimum":0,"title":"Bufferedaheadms","type":"integer"},"autoplayAllowed":{"title":"Autoplayallowed","type":"boolean"}},"required":["trackId","mediaVersion","state","bufferedAheadMs","autoplayAllowed"],"title":"Readiness","type":"object"};

function validate95(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate95.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.trackId === undefined) && (missing0 = "trackId")) || ((data.mediaVersion === undefined) && (missing0 = "mediaVersion"))) || ((data.state === undefined) && (missing0 = "state"))) || ((data.bufferedAheadMs === undefined) && (missing0 = "bufferedAheadMs"))) || ((data.autoplayAllowed === undefined) && (missing0 = "autoplayAllowed"))){
validate95.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "trackId") || (key0 === "mediaVersion")) || (key0 === "state")) || (key0 === "bufferedAheadMs")) || (key0 === "autoplayAllowed"))){
validate95.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.trackId !== undefined){
let data0 = data.trackId;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate95.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate95.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mediaVersion !== undefined){
let data1 = data.mediaVersion;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(func1(data1) > 128){
validate95.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/maxLength",keyword:"maxLength",params:{limit: 128},message:"must NOT have more than 128 characters"}];
return false;
}
else {
if(func1(data1) < 1){
validate95.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate95.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.state !== undefined){
let data2 = data.state;
const _errs6 = errors;
if(typeof data2 !== "string"){
validate95.errors = [{instancePath:instancePath+"/state",schemaPath:"#/properties/state/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((((data2 === "loading") || (data2 === "ready")) || (data2 === "buffering")) || (data2 === "autoplayBlocked")) || (data2 === "error"))){
validate95.errors = [{instancePath:instancePath+"/state",schemaPath:"#/properties/state/enum",keyword:"enum",params:{allowedValues: schema43.properties.state.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.bufferedAheadMs !== undefined){
let data3 = data.bufferedAheadMs;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate95.errors = [{instancePath:instancePath+"/bufferedAheadMs",schemaPath:"#/properties/bufferedAheadMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 900000 || isNaN(data3)){
validate95.errors = [{instancePath:instancePath+"/bufferedAheadMs",schemaPath:"#/properties/bufferedAheadMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate95.errors = [{instancePath:instancePath+"/bufferedAheadMs",schemaPath:"#/properties/bufferedAheadMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.autoplayAllowed !== undefined){
const _errs10 = errors;
if(typeof data.autoplayAllowed !== "boolean"){
validate95.errors = [{instancePath:instancePath+"/autoplayAllowed",schemaPath:"#/properties/autoplayAllowed/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate95.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate95.errors = vErrors;
return errors === 0;
}
validate95.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate94(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate94.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.id === undefined) && (missing0 = "id")) || ((data.displayName === undefined) && (missing0 = "displayName"))) || ((data.role === undefined) && (missing0 = "role"))) || ((data.connectionState === undefined) && (missing0 = "connectionState"))) || ((data.readiness === undefined) && (missing0 = "readiness"))){
validate94.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "id") || (key0 === "displayName")) || (key0 === "role")) || (key0 === "connectionState")) || (key0 === "readiness"))){
validate94.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate94.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate94.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.displayName !== undefined){
const _errs4 = errors;
if(typeof data.displayName !== "string"){
validate94.errors = [{instancePath:instancePath+"/displayName",schemaPath:"#/properties/displayName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.role !== undefined){
let data2 = data.role;
const _errs6 = errors;
if(typeof data2 !== "string"){
validate94.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((data2 === "host") || (data2 === "listener"))){
validate94.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/enum",keyword:"enum",params:{allowedValues: schema42.properties.role.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.connectionState !== undefined){
let data3 = data.connectionState;
const _errs8 = errors;
if(typeof data3 !== "string"){
validate94.errors = [{instancePath:instancePath+"/connectionState",schemaPath:"#/properties/connectionState/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data3 === "online") || (data3 === "offline")) || (data3 === "connecting"))){
validate94.errors = [{instancePath:instancePath+"/connectionState",schemaPath:"#/properties/connectionState/enum",keyword:"enum",params:{allowedValues: schema42.properties.connectionState.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.readiness !== undefined){
let data4 = data.readiness;
const _errs10 = errors;
const _errs11 = errors;
let valid1 = false;
const _errs12 = errors;
if(!(validate95(data4, {instancePath:instancePath+"/readiness",parentData:data,parentDataProperty:"readiness",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate95.errors : vErrors.concat(validate95.errors);
errors = vErrors.length;
}
var _valid0 = _errs12 === errors;
valid1 = valid1 || _valid0;
const _errs13 = errors;
if(data4 !== null){
const err0 = {instancePath:instancePath+"/readiness",schemaPath:"#/properties/readiness/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
var _valid0 = _errs13 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err1 = {instancePath:instancePath+"/readiness",schemaPath:"#/properties/readiness/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
validate94.errors = vErrors;
return false;
}
else {
errors = _errs11;
if(vErrors !== null){
if(_errs11){
vErrors.length = _errs11;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate94.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate94.errors = vErrors;
return errors === 0;
}
validate94.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema44 = {"additionalProperties":false,"properties":{"roomId":{"format":"uuid","title":"Roomid","type":"string"},"epoch":{"format":"uuid","title":"Epoch","type":"string"},"trackId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Trackid"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Mediaversion"},"status":{"enum":["empty","paused","playing","ended"],"title":"Status","type":"string"},"positionMs":{"maximum":900000,"minimum":0,"title":"Positionms","type":"integer"},"anchorServerTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Anchorservertimems","type":"integer"},"durationMs":{"maximum":900000,"minimum":0,"title":"Durationms","type":"integer"},"pendingTransition":{"anyOf":[{"$ref":"#/$defs/PendingTransition"},{"type":"null"}]}},"required":["roomId","epoch","trackId","mediaVersion","status","positionMs","anchorServerTimeMs","durationMs","pendingTransition"],"title":"Playback","type":"object"};
const func7 = Object.prototype.hasOwnProperty;
const schema45 = {"additionalProperties":false,"properties":{"type":{"enum":["play","pause","seek"],"title":"Type","type":"string"},"nextStatus":{"enum":["paused","playing","ended"],"title":"Nextstatus","type":"string"},"positionMs":{"maximum":900000,"minimum":0,"title":"Positionms","type":"integer"},"effectiveAtServerTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Effectiveatservertimems","type":"integer"},"trackId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"default":null,"title":"Trackid"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Mediaversion"}},"required":["type","nextStatus","positionMs","effectiveAtServerTimeMs"],"title":"PendingTransition","type":"object"};

function validate99(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate99.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.type === undefined) && (missing0 = "type")) || ((data.nextStatus === undefined) && (missing0 = "nextStatus"))) || ((data.positionMs === undefined) && (missing0 = "positionMs"))) || ((data.effectiveAtServerTimeMs === undefined) && (missing0 = "effectiveAtServerTimeMs"))){
validate99.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "nextStatus")) || (key0 === "positionMs")) || (key0 === "effectiveAtServerTimeMs")) || (key0 === "trackId")) || (key0 === "mediaVersion"))){
validate99.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
const _errs2 = errors;
if(typeof data0 !== "string"){
validate99.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data0 === "play") || (data0 === "pause")) || (data0 === "seek"))){
validate99.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/enum",keyword:"enum",params:{allowedValues: schema45.properties.type.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nextStatus !== undefined){
let data1 = data.nextStatus;
const _errs4 = errors;
if(typeof data1 !== "string"){
validate99.errors = [{instancePath:instancePath+"/nextStatus",schemaPath:"#/properties/nextStatus/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data1 === "paused") || (data1 === "playing")) || (data1 === "ended"))){
validate99.errors = [{instancePath:instancePath+"/nextStatus",schemaPath:"#/properties/nextStatus/enum",keyword:"enum",params:{allowedValues: schema45.properties.nextStatus.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.positionMs !== undefined){
let data2 = data.positionMs;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate99.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 900000 || isNaN(data2)){
validate99.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate99.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.effectiveAtServerTimeMs !== undefined){
let data3 = data.effectiveAtServerTimeMs;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate99.errors = [{instancePath:instancePath+"/effectiveAtServerTimeMs",schemaPath:"#/properties/effectiveAtServerTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate99.errors = [{instancePath:instancePath+"/effectiveAtServerTimeMs",schemaPath:"#/properties/effectiveAtServerTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate99.errors = [{instancePath:instancePath+"/effectiveAtServerTimeMs",schemaPath:"#/properties/effectiveAtServerTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.trackId !== undefined){
let data4 = data.trackId;
const _errs10 = errors;
const _errs11 = errors;
let valid1 = false;
const _errs12 = errors;
if(errors === _errs12){
if(errors === _errs12){
if(typeof data4 === "string"){
if(!(formats0.test(data4))){
const err0 = {instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/anyOf/0/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
else {
const err1 = {instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
var _valid0 = _errs12 === errors;
valid1 = valid1 || _valid0;
const _errs14 = errors;
if(data4 !== null){
const err2 = {instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs14 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err3 = {instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
validate99.errors = vErrors;
return false;
}
else {
errors = _errs11;
if(vErrors !== null){
if(_errs11){
vErrors.length = _errs11;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mediaVersion !== undefined){
let data5 = data.mediaVersion;
const _errs16 = errors;
const _errs17 = errors;
let valid2 = false;
const _errs18 = errors;
if(typeof data5 !== "string"){
const err4 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
var _valid1 = _errs18 === errors;
valid2 = valid2 || _valid1;
const _errs20 = errors;
if(data5 !== null){
const err5 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
var _valid1 = _errs20 === errors;
valid2 = valid2 || _valid1;
if(!valid2){
const err6 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
validate99.errors = vErrors;
return false;
}
else {
errors = _errs17;
if(vErrors !== null){
if(_errs17){
vErrors.length = _errs17;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate99.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate99.errors = vErrors;
return errors === 0;
}
validate99.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate98(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate98.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((((data.roomId === undefined) && (missing0 = "roomId")) || ((data.epoch === undefined) && (missing0 = "epoch"))) || ((data.trackId === undefined) && (missing0 = "trackId"))) || ((data.mediaVersion === undefined) && (missing0 = "mediaVersion"))) || ((data.status === undefined) && (missing0 = "status"))) || ((data.positionMs === undefined) && (missing0 = "positionMs"))) || ((data.anchorServerTimeMs === undefined) && (missing0 = "anchorServerTimeMs"))) || ((data.durationMs === undefined) && (missing0 = "durationMs"))) || ((data.pendingTransition === undefined) && (missing0 = "pendingTransition"))){
validate98.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema44.properties, key0))){
validate98.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.roomId !== undefined){
let data0 = data.roomId;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate98.errors = [{instancePath:instancePath+"/roomId",schemaPath:"#/properties/roomId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate98.errors = [{instancePath:instancePath+"/roomId",schemaPath:"#/properties/roomId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.epoch !== undefined){
let data1 = data.epoch;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate98.errors = [{instancePath:instancePath+"/epoch",schemaPath:"#/properties/epoch/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate98.errors = [{instancePath:instancePath+"/epoch",schemaPath:"#/properties/epoch/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.trackId !== undefined){
let data2 = data.trackId;
const _errs6 = errors;
const _errs7 = errors;
let valid1 = false;
const _errs8 = errors;
if(errors === _errs8){
if(errors === _errs8){
if(typeof data2 === "string"){
if(!(formats0.test(data2))){
const err0 = {instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/anyOf/0/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
else {
const err1 = {instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
var _valid0 = _errs8 === errors;
valid1 = valid1 || _valid0;
const _errs10 = errors;
if(data2 !== null){
const err2 = {instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs10 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err3 = {instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
validate98.errors = vErrors;
return false;
}
else {
errors = _errs7;
if(vErrors !== null){
if(_errs7){
vErrors.length = _errs7;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mediaVersion !== undefined){
let data3 = data.mediaVersion;
const _errs12 = errors;
const _errs13 = errors;
let valid2 = false;
const _errs14 = errors;
if(typeof data3 !== "string"){
const err4 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
var _valid1 = _errs14 === errors;
valid2 = valid2 || _valid1;
const _errs16 = errors;
if(data3 !== null){
const err5 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
var _valid1 = _errs16 === errors;
valid2 = valid2 || _valid1;
if(!valid2){
const err6 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
validate98.errors = vErrors;
return false;
}
else {
errors = _errs13;
if(vErrors !== null){
if(_errs13){
vErrors.length = _errs13;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
let data4 = data.status;
const _errs18 = errors;
if(typeof data4 !== "string"){
validate98.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((((data4 === "empty") || (data4 === "paused")) || (data4 === "playing")) || (data4 === "ended"))){
validate98.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema44.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.positionMs !== undefined){
let data5 = data.positionMs;
const _errs20 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate98.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs20){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 900000 || isNaN(data5)){
validate98.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate98.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs20 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.anchorServerTimeMs !== undefined){
let data6 = data.anchorServerTimeMs;
const _errs22 = errors;
if(!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))){
validate98.errors = [{instancePath:instancePath+"/anchorServerTimeMs",schemaPath:"#/properties/anchorServerTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs22){
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 > 9007199254740991 || isNaN(data6)){
validate98.errors = [{instancePath:instancePath+"/anchorServerTimeMs",schemaPath:"#/properties/anchorServerTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data6 < 0 || isNaN(data6)){
validate98.errors = [{instancePath:instancePath+"/anchorServerTimeMs",schemaPath:"#/properties/anchorServerTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs22 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.durationMs !== undefined){
let data7 = data.durationMs;
const _errs24 = errors;
if(!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))){
validate98.errors = [{instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs24){
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 > 900000 || isNaN(data7)){
validate98.errors = [{instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data7 < 0 || isNaN(data7)){
validate98.errors = [{instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs24 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.pendingTransition !== undefined){
let data8 = data.pendingTransition;
const _errs26 = errors;
const _errs27 = errors;
let valid3 = false;
const _errs28 = errors;
if(!(validate99(data8, {instancePath:instancePath+"/pendingTransition",parentData:data,parentDataProperty:"pendingTransition",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate99.errors : vErrors.concat(validate99.errors);
errors = vErrors.length;
}
var _valid2 = _errs28 === errors;
valid3 = valid3 || _valid2;
const _errs29 = errors;
if(data8 !== null){
const err7 = {instancePath:instancePath+"/pendingTransition",schemaPath:"#/properties/pendingTransition/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
var _valid2 = _errs29 === errors;
valid3 = valid3 || _valid2;
if(!valid3){
const err8 = {instancePath:instancePath+"/pendingTransition",schemaPath:"#/properties/pendingTransition/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
validate98.errors = vErrors;
return false;
}
else {
errors = _errs27;
if(vErrors !== null){
if(_errs27){
vErrors.length = _errs27;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs26 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate98.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate98.errors = vErrors;
return errors === 0;
}
validate98.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate91(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate91.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.room === undefined) && (missing0 = "room")) || ((data.participants === undefined) && (missing0 = "participants"))) || ((data.playback === undefined) && (missing0 = "playback"))) || ((data.presenceSeq === undefined) && (missing0 = "presenceSeq"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))){
validate91.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "room") || (key0 === "participants")) || (key0 === "playback")) || (key0 === "presenceSeq")) || (key0 === "playbackRevision"))){
validate91.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.room !== undefined){
const _errs2 = errors;
if(!(validate92(data.room, {instancePath:instancePath+"/room",parentData:data,parentDataProperty:"room",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate92.errors : vErrors.concat(validate92.errors);
errors = vErrors.length;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.participants !== undefined){
let data1 = data.participants;
const _errs3 = errors;
if(errors === _errs3){
if(Array.isArray(data1)){
var valid1 = true;
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
const _errs5 = errors;
if(!(validate94(data1[i0], {instancePath:instancePath+"/participants/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate94.errors : vErrors.concat(validate94.errors);
errors = vErrors.length;
}
var valid1 = _errs5 === errors;
if(!valid1){
break;
}
}
}
else {
validate91.errors = [{instancePath:instancePath+"/participants",schemaPath:"#/properties/participants/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playback !== undefined){
const _errs6 = errors;
if(!(validate98(data.playback, {instancePath:instancePath+"/playback",parentData:data,parentDataProperty:"playback",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate98.errors : vErrors.concat(validate98.errors);
errors = vErrors.length;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.presenceSeq !== undefined){
let data4 = data.presenceSeq;
const _errs7 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate91.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs7){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate91.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 0 || isNaN(data4)){
validate91.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playbackRevision !== undefined){
let data5 = data.playbackRevision;
const _errs9 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate91.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 9007199254740991 || isNaN(data5)){
validate91.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate91.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate91.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate91.errors = vErrors;
return errors === 0;
}
validate91.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate90(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate90.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.connectionId === undefined) && (missing0 = "connectionId")) || ((data.epoch === undefined) && (missing0 = "epoch"))) || ((data.snapshot === undefined) && (missing0 = "snapshot"))){
validate90.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "connectionId") || (key0 === "epoch")) || (key0 === "protocolVersion")) || (key0 === "snapshot"))){
validate90.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.connectionId !== undefined){
let data0 = data.connectionId;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate90.errors = [{instancePath:instancePath+"/connectionId",schemaPath:"#/properties/connectionId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate90.errors = [{instancePath:instancePath+"/connectionId",schemaPath:"#/properties/connectionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.epoch !== undefined){
let data1 = data.epoch;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate90.errors = [{instancePath:instancePath+"/epoch",schemaPath:"#/properties/epoch/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate90.errors = [{instancePath:instancePath+"/epoch",schemaPath:"#/properties/epoch/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.protocolVersion !== undefined){
let data2 = data.protocolVersion;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate90.errors = [{instancePath:instancePath+"/protocolVersion",schemaPath:"#/properties/protocolVersion/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data2){
validate90.errors = [{instancePath:instancePath+"/protocolVersion",schemaPath:"#/properties/protocolVersion/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.snapshot !== undefined){
const _errs8 = errors;
if(!(validate91(data.snapshot, {instancePath:instancePath+"/snapshot",parentData:data,parentDataProperty:"snapshot",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate91.errors : vErrors.concat(validate91.errors);
errors = vErrors.length;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate90.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate90.errors = vErrors;
return errors === 0;
}
validate90.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate89(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate89.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.v === undefined) && (missing0 = "v")) || ((data.eventId === undefined) && (missing0 = "eventId"))) || ((data.serverTimeMs === undefined) && (missing0 = "serverTimeMs"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate89.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate89.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate89.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate89.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.eventId !== undefined){
let data1 = data.eventId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate89.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate89.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.serverTimeMs !== undefined){
let data2 = data.serverTimeMs;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate89.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate89.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate89.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playbackRevision !== undefined){
let data3 = data.playbackRevision;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate89.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate89.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate89.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data4 = data.type;
const _errs10 = errors;
if(typeof data4 !== "string"){
validate89.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("hello" !== data4){
validate89.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "hello"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs12 = errors;
if(!(validate90(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate90.errors : vErrors.concat(validate90.errors);
errors = vErrors.length;
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate89.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate89.errors = vErrors;
return errors === 0;
}
validate89.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema46 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"room.snapshot","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/Snapshot"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"RoomSnapshot","type":"object"};

function validate105(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate105.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.v === undefined) && (missing0 = "v")) || ((data.eventId === undefined) && (missing0 = "eventId"))) || ((data.serverTimeMs === undefined) && (missing0 = "serverTimeMs"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate105.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate105.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate105.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate105.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.eventId !== undefined){
let data1 = data.eventId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate105.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate105.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.serverTimeMs !== undefined){
let data2 = data.serverTimeMs;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate105.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate105.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate105.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playbackRevision !== undefined){
let data3 = data.playbackRevision;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate105.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate105.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate105.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data4 = data.type;
const _errs10 = errors;
if(typeof data4 !== "string"){
validate105.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("room.snapshot" !== data4){
validate105.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "room.snapshot"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs12 = errors;
if(!(validate91(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate91.errors : vErrors.concat(validate91.errors);
errors = vErrors.length;
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate105.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate105.errors = vErrors;
return errors === 0;
}
validate105.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema47 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"playback.state","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/Playback"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"PlaybackState","type":"object"};

function validate108(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate108.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.v === undefined) && (missing0 = "v")) || ((data.eventId === undefined) && (missing0 = "eventId"))) || ((data.serverTimeMs === undefined) && (missing0 = "serverTimeMs"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate108.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate108.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate108.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate108.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.eventId !== undefined){
let data1 = data.eventId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate108.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate108.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.serverTimeMs !== undefined){
let data2 = data.serverTimeMs;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate108.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate108.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate108.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playbackRevision !== undefined){
let data3 = data.playbackRevision;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate108.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate108.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate108.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data4 = data.type;
const _errs10 = errors;
if(typeof data4 !== "string"){
validate108.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("playback.state" !== data4){
validate108.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "playback.state"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs12 = errors;
if(!(validate98(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate98.errors : vErrors.concat(validate98.errors);
errors = vErrors.length;
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate108.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate108.errors = vErrors;
return errors === 0;
}
validate108.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema48 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"clock.reply","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ClockReplyPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"ClockReply","type":"object"};
const schema49 = {"additionalProperties":false,"properties":{"clientSentAtMs":{"maximum":9007199254740991,"minimum":0,"title":"Clientsentatms","type":"integer"},"probeId":{"format":"uuid","title":"Probeid","type":"string"},"serverReceivedAtMs":{"maximum":9007199254740991,"minimum":0,"title":"Serverreceivedatms","type":"integer"},"serverSentAtMs":{"maximum":9007199254740991,"minimum":0,"title":"Serversentatms","type":"integer"}},"required":["clientSentAtMs","probeId","serverReceivedAtMs","serverSentAtMs"],"title":"ClockReplyPayload","type":"object"};

function validate112(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate112.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.clientSentAtMs === undefined) && (missing0 = "clientSentAtMs")) || ((data.probeId === undefined) && (missing0 = "probeId"))) || ((data.serverReceivedAtMs === undefined) && (missing0 = "serverReceivedAtMs"))) || ((data.serverSentAtMs === undefined) && (missing0 = "serverSentAtMs"))){
validate112.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "clientSentAtMs") || (key0 === "probeId")) || (key0 === "serverReceivedAtMs")) || (key0 === "serverSentAtMs"))){
validate112.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.clientSentAtMs !== undefined){
let data0 = data.clientSentAtMs;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate112.errors = [{instancePath:instancePath+"/clientSentAtMs",schemaPath:"#/properties/clientSentAtMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs2){
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 > 9007199254740991 || isNaN(data0)){
validate112.errors = [{instancePath:instancePath+"/clientSentAtMs",schemaPath:"#/properties/clientSentAtMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data0 < 0 || isNaN(data0)){
validate112.errors = [{instancePath:instancePath+"/clientSentAtMs",schemaPath:"#/properties/clientSentAtMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.probeId !== undefined){
let data1 = data.probeId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate112.errors = [{instancePath:instancePath+"/probeId",schemaPath:"#/properties/probeId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate112.errors = [{instancePath:instancePath+"/probeId",schemaPath:"#/properties/probeId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.serverReceivedAtMs !== undefined){
let data2 = data.serverReceivedAtMs;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate112.errors = [{instancePath:instancePath+"/serverReceivedAtMs",schemaPath:"#/properties/serverReceivedAtMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate112.errors = [{instancePath:instancePath+"/serverReceivedAtMs",schemaPath:"#/properties/serverReceivedAtMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate112.errors = [{instancePath:instancePath+"/serverReceivedAtMs",schemaPath:"#/properties/serverReceivedAtMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.serverSentAtMs !== undefined){
let data3 = data.serverSentAtMs;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate112.errors = [{instancePath:instancePath+"/serverSentAtMs",schemaPath:"#/properties/serverSentAtMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate112.errors = [{instancePath:instancePath+"/serverSentAtMs",schemaPath:"#/properties/serverSentAtMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate112.errors = [{instancePath:instancePath+"/serverSentAtMs",schemaPath:"#/properties/serverSentAtMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate112.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate112.errors = vErrors;
return errors === 0;
}
validate112.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate111(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate111.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.v === undefined) && (missing0 = "v")) || ((data.eventId === undefined) && (missing0 = "eventId"))) || ((data.serverTimeMs === undefined) && (missing0 = "serverTimeMs"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate111.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate111.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate111.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate111.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.eventId !== undefined){
let data1 = data.eventId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate111.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate111.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.serverTimeMs !== undefined){
let data2 = data.serverTimeMs;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate111.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate111.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate111.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playbackRevision !== undefined){
let data3 = data.playbackRevision;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate111.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate111.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate111.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data4 = data.type;
const _errs10 = errors;
if(typeof data4 !== "string"){
validate111.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("clock.reply" !== data4){
validate111.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "clock.reply"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs12 = errors;
if(!(validate112(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate112.errors : vErrors.concat(validate112.errors);
errors = vErrors.length;
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate111.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate111.errors = vErrors;
return errors === 0;
}
validate111.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema50 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"heartbeat.ping","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/PingPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"HeartbeatPing","type":"object"};
const schema51 = {"additionalProperties":false,"properties":{"pingId":{"format":"uuid","title":"Pingid","type":"string"}},"required":["pingId"],"title":"PingPayload","type":"object"};

function validate116(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate116.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.pingId === undefined) && (missing0 = "pingId")){
validate116.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "pingId")){
validate116.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.pingId !== undefined){
let data0 = data.pingId;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate116.errors = [{instancePath:instancePath+"/pingId",schemaPath:"#/properties/pingId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate116.errors = [{instancePath:instancePath+"/pingId",schemaPath:"#/properties/pingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
}
}
}
}
else {
validate116.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate116.errors = vErrors;
return errors === 0;
}
validate116.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate115(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate115.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.v === undefined) && (missing0 = "v")) || ((data.eventId === undefined) && (missing0 = "eventId"))) || ((data.serverTimeMs === undefined) && (missing0 = "serverTimeMs"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate115.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate115.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate115.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate115.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.eventId !== undefined){
let data1 = data.eventId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate115.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate115.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.serverTimeMs !== undefined){
let data2 = data.serverTimeMs;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate115.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate115.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate115.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playbackRevision !== undefined){
let data3 = data.playbackRevision;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate115.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate115.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate115.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data4 = data.type;
const _errs10 = errors;
if(typeof data4 !== "string"){
validate115.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("heartbeat.ping" !== data4){
validate115.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "heartbeat.ping"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs12 = errors;
if(!(validate116(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate116.errors : vErrors.concat(validate116.errors);
errors = vErrors.length;
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate115.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate115.errors = vErrors;
return errors === 0;
}
validate115.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema52 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"presence.changed","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/PresencePayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"PresenceChanged","type":"object"};
const schema53 = {"additionalProperties":false,"properties":{"presenceSeq":{"maximum":9007199254740991,"minimum":0,"title":"Presenceseq","type":"integer"},"participants":{"items":{"$ref":"#/$defs/Participant"},"title":"Participants","type":"array"}},"required":["presenceSeq","participants"],"title":"PresencePayload","type":"object"};

function validate120(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate120.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.presenceSeq === undefined) && (missing0 = "presenceSeq")) || ((data.participants === undefined) && (missing0 = "participants"))){
validate120.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "presenceSeq") || (key0 === "participants"))){
validate120.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.presenceSeq !== undefined){
let data0 = data.presenceSeq;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate120.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs2){
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 > 9007199254740991 || isNaN(data0)){
validate120.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data0 < 0 || isNaN(data0)){
validate120.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.participants !== undefined){
let data1 = data.participants;
const _errs4 = errors;
if(errors === _errs4){
if(Array.isArray(data1)){
var valid1 = true;
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
const _errs6 = errors;
if(!(validate94(data1[i0], {instancePath:instancePath+"/participants/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate94.errors : vErrors.concat(validate94.errors);
errors = vErrors.length;
}
var valid1 = _errs6 === errors;
if(!valid1){
break;
}
}
}
else {
validate120.errors = [{instancePath:instancePath+"/participants",schemaPath:"#/properties/participants/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate120.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate120.errors = vErrors;
return errors === 0;
}
validate120.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate119(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate119.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.v === undefined) && (missing0 = "v")) || ((data.eventId === undefined) && (missing0 = "eventId"))) || ((data.serverTimeMs === undefined) && (missing0 = "serverTimeMs"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate119.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate119.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate119.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate119.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.eventId !== undefined){
let data1 = data.eventId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate119.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate119.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.serverTimeMs !== undefined){
let data2 = data.serverTimeMs;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate119.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate119.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate119.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playbackRevision !== undefined){
let data3 = data.playbackRevision;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate119.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate119.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate119.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data4 = data.type;
const _errs10 = errors;
if(typeof data4 !== "string"){
validate119.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("presence.changed" !== data4){
validate119.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "presence.changed"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs12 = errors;
if(!(validate120(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate120.errors : vErrors.concat(validate120.errors);
errors = vErrors.length;
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate119.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate119.errors = vErrors;
return errors === 0;
}
validate119.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema54 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"host.changed","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/HostPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"HostChanged","type":"object"};
const schema55 = {"additionalProperties":false,"properties":{"participantId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Participantid"}},"required":["participantId"],"title":"HostPayload","type":"object"};

function validate125(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate125.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.participantId === undefined) && (missing0 = "participantId")){
validate125.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "participantId")){
validate125.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.participantId !== undefined){
let data0 = data.participantId;
const _errs3 = errors;
let valid1 = false;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
const err0 = {instancePath:instancePath+"/participantId",schemaPath:"#/properties/participantId/anyOf/0/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
else {
const err1 = {instancePath:instancePath+"/participantId",schemaPath:"#/properties/participantId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
var _valid0 = _errs4 === errors;
valid1 = valid1 || _valid0;
const _errs6 = errors;
if(data0 !== null){
const err2 = {instancePath:instancePath+"/participantId",schemaPath:"#/properties/participantId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs6 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err3 = {instancePath:instancePath+"/participantId",schemaPath:"#/properties/participantId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
validate125.errors = vErrors;
return false;
}
else {
errors = _errs3;
if(vErrors !== null){
if(_errs3){
vErrors.length = _errs3;
}
else {
vErrors = null;
}
}
}
}
}
}
}
else {
validate125.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate125.errors = vErrors;
return errors === 0;
}
validate125.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate124(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate124.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.v === undefined) && (missing0 = "v")) || ((data.eventId === undefined) && (missing0 = "eventId"))) || ((data.serverTimeMs === undefined) && (missing0 = "serverTimeMs"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate124.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate124.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate124.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate124.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.eventId !== undefined){
let data1 = data.eventId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate124.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate124.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.serverTimeMs !== undefined){
let data2 = data.serverTimeMs;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate124.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate124.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate124.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playbackRevision !== undefined){
let data3 = data.playbackRevision;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate124.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate124.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate124.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data4 = data.type;
const _errs10 = errors;
if(typeof data4 !== "string"){
validate124.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("host.changed" !== data4){
validate124.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "host.changed"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs12 = errors;
if(!(validate125(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate125.errors : vErrors.concat(validate125.errors);
errors = vErrors.length;
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate124.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate124.errors = vErrors;
return errors === 0;
}
validate124.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema56 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"track.updated","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/TrackPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"TrackUpdated","type":"object"};
const schema57 = {"additionalProperties":false,"properties":{"track":{"$ref":"#/$defs/Track"}},"required":["track"],"title":"TrackPayload","type":"object"};
const schema58 = {"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"title":{"title":"Title","type":"string"},"artist":{"title":"Artist","type":"string"},"durationMs":{"anyOf":[{"maximum":900000,"minimum":0,"type":"integer"},{"type":"null"}],"title":"Durationms"},"status":{"enum":["uploading","processing","ready","failed"],"title":"Status","type":"string"},"errorCode":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Errorcode"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Mediaversion"},"coverUrl":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Coverurl"},"sourceUri":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Sourceuri"},"licenseId":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Licenseid"},"licenseUri":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Licenseuri"}},"required":["id","title","artist","durationMs","status"],"title":"Track","type":"object"};

function validate130(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate130.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.id === undefined) && (missing0 = "id")) || ((data.title === undefined) && (missing0 = "title"))) || ((data.artist === undefined) && (missing0 = "artist"))) || ((data.durationMs === undefined) && (missing0 = "durationMs"))) || ((data.status === undefined) && (missing0 = "status"))){
validate130.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema58.properties, key0))){
validate130.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate130.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate130.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.title !== undefined){
const _errs4 = errors;
if(typeof data.title !== "string"){
validate130.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.artist !== undefined){
const _errs6 = errors;
if(typeof data.artist !== "string"){
validate130.errors = [{instancePath:instancePath+"/artist",schemaPath:"#/properties/artist/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.durationMs !== undefined){
let data3 = data.durationMs;
const _errs8 = errors;
const _errs9 = errors;
let valid1 = false;
const _errs10 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
const err0 = {instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/anyOf/0/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(errors === _errs10){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 900000 || isNaN(data3)){
const err1 = {instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/anyOf/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
else {
if(data3 < 0 || isNaN(data3)){
const err2 = {instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/anyOf/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
}
}
var _valid0 = _errs10 === errors;
valid1 = valid1 || _valid0;
const _errs12 = errors;
if(data3 !== null){
const err3 = {instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
var _valid0 = _errs12 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err4 = {instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
validate130.errors = vErrors;
return false;
}
else {
errors = _errs9;
if(vErrors !== null){
if(_errs9){
vErrors.length = _errs9;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
let data4 = data.status;
const _errs14 = errors;
if(typeof data4 !== "string"){
validate130.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((((data4 === "uploading") || (data4 === "processing")) || (data4 === "ready")) || (data4 === "failed"))){
validate130.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema58.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.errorCode !== undefined){
let data5 = data.errorCode;
const _errs16 = errors;
const _errs17 = errors;
let valid2 = false;
const _errs18 = errors;
if(typeof data5 !== "string"){
const err5 = {instancePath:instancePath+"/errorCode",schemaPath:"#/properties/errorCode/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
var _valid1 = _errs18 === errors;
valid2 = valid2 || _valid1;
const _errs20 = errors;
if(data5 !== null){
const err6 = {instancePath:instancePath+"/errorCode",schemaPath:"#/properties/errorCode/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var _valid1 = _errs20 === errors;
valid2 = valid2 || _valid1;
if(!valid2){
const err7 = {instancePath:instancePath+"/errorCode",schemaPath:"#/properties/errorCode/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
validate130.errors = vErrors;
return false;
}
else {
errors = _errs17;
if(vErrors !== null){
if(_errs17){
vErrors.length = _errs17;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mediaVersion !== undefined){
let data6 = data.mediaVersion;
const _errs22 = errors;
const _errs23 = errors;
let valid3 = false;
const _errs24 = errors;
if(typeof data6 !== "string"){
const err8 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
var _valid2 = _errs24 === errors;
valid3 = valid3 || _valid2;
const _errs26 = errors;
if(data6 !== null){
const err9 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
var _valid2 = _errs26 === errors;
valid3 = valid3 || _valid2;
if(!valid3){
const err10 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
validate130.errors = vErrors;
return false;
}
else {
errors = _errs23;
if(vErrors !== null){
if(_errs23){
vErrors.length = _errs23;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs22 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.coverUrl !== undefined){
let data7 = data.coverUrl;
const _errs28 = errors;
const _errs29 = errors;
let valid4 = false;
const _errs30 = errors;
if(typeof data7 !== "string"){
const err11 = {instancePath:instancePath+"/coverUrl",schemaPath:"#/properties/coverUrl/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
var _valid3 = _errs30 === errors;
valid4 = valid4 || _valid3;
const _errs32 = errors;
if(data7 !== null){
const err12 = {instancePath:instancePath+"/coverUrl",schemaPath:"#/properties/coverUrl/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
var _valid3 = _errs32 === errors;
valid4 = valid4 || _valid3;
if(!valid4){
const err13 = {instancePath:instancePath+"/coverUrl",schemaPath:"#/properties/coverUrl/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
validate130.errors = vErrors;
return false;
}
else {
errors = _errs29;
if(vErrors !== null){
if(_errs29){
vErrors.length = _errs29;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs28 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sourceUri !== undefined){
let data8 = data.sourceUri;
const _errs34 = errors;
const _errs35 = errors;
let valid5 = false;
const _errs36 = errors;
if(typeof data8 !== "string"){
const err14 = {instancePath:instancePath+"/sourceUri",schemaPath:"#/properties/sourceUri/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
var _valid4 = _errs36 === errors;
valid5 = valid5 || _valid4;
const _errs38 = errors;
if(data8 !== null){
const err15 = {instancePath:instancePath+"/sourceUri",schemaPath:"#/properties/sourceUri/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
var _valid4 = _errs38 === errors;
valid5 = valid5 || _valid4;
if(!valid5){
const err16 = {instancePath:instancePath+"/sourceUri",schemaPath:"#/properties/sourceUri/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
validate130.errors = vErrors;
return false;
}
else {
errors = _errs35;
if(vErrors !== null){
if(_errs35){
vErrors.length = _errs35;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs34 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.licenseId !== undefined){
let data9 = data.licenseId;
const _errs40 = errors;
const _errs41 = errors;
let valid6 = false;
const _errs42 = errors;
if(typeof data9 !== "string"){
const err17 = {instancePath:instancePath+"/licenseId",schemaPath:"#/properties/licenseId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
var _valid5 = _errs42 === errors;
valid6 = valid6 || _valid5;
const _errs44 = errors;
if(data9 !== null){
const err18 = {instancePath:instancePath+"/licenseId",schemaPath:"#/properties/licenseId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
var _valid5 = _errs44 === errors;
valid6 = valid6 || _valid5;
if(!valid6){
const err19 = {instancePath:instancePath+"/licenseId",schemaPath:"#/properties/licenseId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
validate130.errors = vErrors;
return false;
}
else {
errors = _errs41;
if(vErrors !== null){
if(_errs41){
vErrors.length = _errs41;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs40 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.licenseUri !== undefined){
let data10 = data.licenseUri;
const _errs46 = errors;
const _errs47 = errors;
let valid7 = false;
const _errs48 = errors;
if(typeof data10 !== "string"){
const err20 = {instancePath:instancePath+"/licenseUri",schemaPath:"#/properties/licenseUri/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
var _valid6 = _errs48 === errors;
valid7 = valid7 || _valid6;
const _errs50 = errors;
if(data10 !== null){
const err21 = {instancePath:instancePath+"/licenseUri",schemaPath:"#/properties/licenseUri/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
var _valid6 = _errs50 === errors;
valid7 = valid7 || _valid6;
if(!valid7){
const err22 = {instancePath:instancePath+"/licenseUri",schemaPath:"#/properties/licenseUri/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
validate130.errors = vErrors;
return false;
}
else {
errors = _errs47;
if(vErrors !== null){
if(_errs47){
vErrors.length = _errs47;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs46 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate130.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate130.errors = vErrors;
return errors === 0;
}
validate130.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate129(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate129.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.track === undefined) && (missing0 = "track")){
validate129.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "track")){
validate129.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.track !== undefined){
if(!(validate130(data.track, {instancePath:instancePath+"/track",parentData:data,parentDataProperty:"track",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate130.errors : vErrors.concat(validate130.errors);
errors = vErrors.length;
}
}
}
}
}
else {
validate129.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate129.errors = vErrors;
return errors === 0;
}
validate129.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate128(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate128.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.v === undefined) && (missing0 = "v")) || ((data.eventId === undefined) && (missing0 = "eventId"))) || ((data.serverTimeMs === undefined) && (missing0 = "serverTimeMs"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate128.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate128.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate128.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate128.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.eventId !== undefined){
let data1 = data.eventId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate128.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate128.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.serverTimeMs !== undefined){
let data2 = data.serverTimeMs;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate128.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate128.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate128.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playbackRevision !== undefined){
let data3 = data.playbackRevision;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate128.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate128.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate128.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data4 = data.type;
const _errs10 = errors;
if(typeof data4 !== "string"){
validate128.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("track.updated" !== data4){
validate128.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "track.updated"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs12 = errors;
if(!(validate129(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate129.errors : vErrors.concat(validate129.errors);
errors = vErrors.length;
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate128.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate128.errors = vErrors;
return errors === 0;
}
validate128.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema59 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"room.closed","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ClosedPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"RoomClosed","type":"object"};
const schema60 = {"additionalProperties":false,"properties":{"reason":{"enum":["closedByHost","expired","emptyTimeout"],"title":"Reason","type":"string"}},"required":["reason"],"title":"ClosedPayload","type":"object"};

function validate135(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate135.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.reason === undefined) && (missing0 = "reason")){
validate135.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "reason")){
validate135.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.reason !== undefined){
let data0 = data.reason;
if(typeof data0 !== "string"){
validate135.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data0 === "closedByHost") || (data0 === "expired")) || (data0 === "emptyTimeout"))){
validate135.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/enum",keyword:"enum",params:{allowedValues: schema60.properties.reason.enum},message:"must be equal to one of the allowed values"}];
return false;
}
}
}
}
}
else {
validate135.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate135.errors = vErrors;
return errors === 0;
}
validate135.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate134(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate134.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.v === undefined) && (missing0 = "v")) || ((data.eventId === undefined) && (missing0 = "eventId"))) || ((data.serverTimeMs === undefined) && (missing0 = "serverTimeMs"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate134.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate134.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate134.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate134.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.eventId !== undefined){
let data1 = data.eventId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate134.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate134.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.serverTimeMs !== undefined){
let data2 = data.serverTimeMs;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate134.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate134.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate134.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playbackRevision !== undefined){
let data3 = data.playbackRevision;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate134.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate134.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate134.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data4 = data.type;
const _errs10 = errors;
if(typeof data4 !== "string"){
validate134.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("room.closed" !== data4){
validate134.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "room.closed"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs12 = errors;
if(!(validate135(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate135.errors : vErrors.concat(validate135.errors);
errors = vErrors.length;
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate134.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate134.errors = vErrors;
return errors === 0;
}
validate134.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema61 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"command.ack","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/AckPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"CommandAck","type":"object"};
const schema62 = {"additionalProperties":false,"properties":{"requestId":{"format":"uuid","title":"Requestid","type":"string"},"acceptedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Acceptedplaybackrevision","type":"integer"},"effectiveAtServerTimeMs":{"anyOf":[{"maximum":9007199254740991,"minimum":0,"type":"integer"},{"type":"null"}],"default":null,"title":"Effectiveatservertimems"}},"required":["requestId","acceptedPlaybackRevision"],"title":"AckPayload","type":"object"};

function validate139(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate139.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.requestId === undefined) && (missing0 = "requestId")) || ((data.acceptedPlaybackRevision === undefined) && (missing0 = "acceptedPlaybackRevision"))){
validate139.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "requestId") || (key0 === "acceptedPlaybackRevision")) || (key0 === "effectiveAtServerTimeMs"))){
validate139.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.requestId !== undefined){
let data0 = data.requestId;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate139.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate139.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.acceptedPlaybackRevision !== undefined){
let data1 = data.acceptedPlaybackRevision;
const _errs4 = errors;
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
validate139.errors = [{instancePath:instancePath+"/acceptedPlaybackRevision",schemaPath:"#/properties/acceptedPlaybackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs4){
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 > 9007199254740991 || isNaN(data1)){
validate139.errors = [{instancePath:instancePath+"/acceptedPlaybackRevision",schemaPath:"#/properties/acceptedPlaybackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data1 < 0 || isNaN(data1)){
validate139.errors = [{instancePath:instancePath+"/acceptedPlaybackRevision",schemaPath:"#/properties/acceptedPlaybackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.effectiveAtServerTimeMs !== undefined){
let data2 = data.effectiveAtServerTimeMs;
const _errs6 = errors;
const _errs7 = errors;
let valid1 = false;
const _errs8 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
const err0 = {instancePath:instancePath+"/effectiveAtServerTimeMs",schemaPath:"#/properties/effectiveAtServerTimeMs/anyOf/0/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(errors === _errs8){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
const err1 = {instancePath:instancePath+"/effectiveAtServerTimeMs",schemaPath:"#/properties/effectiveAtServerTimeMs/anyOf/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
else {
if(data2 < 0 || isNaN(data2)){
const err2 = {instancePath:instancePath+"/effectiveAtServerTimeMs",schemaPath:"#/properties/effectiveAtServerTimeMs/anyOf/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
}
}
var _valid0 = _errs8 === errors;
valid1 = valid1 || _valid0;
const _errs10 = errors;
if(data2 !== null){
const err3 = {instancePath:instancePath+"/effectiveAtServerTimeMs",schemaPath:"#/properties/effectiveAtServerTimeMs/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
var _valid0 = _errs10 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err4 = {instancePath:instancePath+"/effectiveAtServerTimeMs",schemaPath:"#/properties/effectiveAtServerTimeMs/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
validate139.errors = vErrors;
return false;
}
else {
errors = _errs7;
if(vErrors !== null){
if(_errs7){
vErrors.length = _errs7;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate139.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate139.errors = vErrors;
return errors === 0;
}
validate139.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate138(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate138.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.v === undefined) && (missing0 = "v")) || ((data.eventId === undefined) && (missing0 = "eventId"))) || ((data.serverTimeMs === undefined) && (missing0 = "serverTimeMs"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate138.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate138.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate138.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate138.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.eventId !== undefined){
let data1 = data.eventId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate138.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate138.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.serverTimeMs !== undefined){
let data2 = data.serverTimeMs;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate138.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate138.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate138.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playbackRevision !== undefined){
let data3 = data.playbackRevision;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate138.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate138.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate138.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data4 = data.type;
const _errs10 = errors;
if(typeof data4 !== "string"){
validate138.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("command.ack" !== data4){
validate138.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "command.ack"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs12 = errors;
if(!(validate139(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate139.errors : vErrors.concat(validate139.errors);
errors = vErrors.length;
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate138.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate138.errors = vErrors;
return errors === 0;
}
validate138.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema63 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"command.error","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ErrorPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"CommandError","type":"object"};
const schema64 = {"additionalProperties":false,"properties":{"requestId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Requestid"},"code":{"title":"Code","type":"string"},"message":{"title":"Message","type":"string"},"snapshot":{"anyOf":[{"$ref":"#/$defs/Snapshot"},{"type":"null"}],"default":null}},"required":["requestId","code","message"],"title":"ErrorPayload","type":"object"};

function validate143(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate143.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.requestId === undefined) && (missing0 = "requestId")) || ((data.code === undefined) && (missing0 = "code"))) || ((data.message === undefined) && (missing0 = "message"))){
validate143.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "requestId") || (key0 === "code")) || (key0 === "message")) || (key0 === "snapshot"))){
validate143.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.requestId !== undefined){
let data0 = data.requestId;
const _errs2 = errors;
const _errs3 = errors;
let valid1 = false;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
const err0 = {instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/anyOf/0/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
else {
const err1 = {instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
var _valid0 = _errs4 === errors;
valid1 = valid1 || _valid0;
const _errs6 = errors;
if(data0 !== null){
const err2 = {instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs6 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err3 = {instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
validate143.errors = vErrors;
return false;
}
else {
errors = _errs3;
if(vErrors !== null){
if(_errs3){
vErrors.length = _errs3;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.code !== undefined){
const _errs8 = errors;
if(typeof data.code !== "string"){
validate143.errors = [{instancePath:instancePath+"/code",schemaPath:"#/properties/code/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.message !== undefined){
const _errs10 = errors;
if(typeof data.message !== "string"){
validate143.errors = [{instancePath:instancePath+"/message",schemaPath:"#/properties/message/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.snapshot !== undefined){
let data3 = data.snapshot;
const _errs12 = errors;
const _errs13 = errors;
let valid2 = false;
const _errs14 = errors;
if(!(validate91(data3, {instancePath:instancePath+"/snapshot",parentData:data,parentDataProperty:"snapshot",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate91.errors : vErrors.concat(validate91.errors);
errors = vErrors.length;
}
var _valid1 = _errs14 === errors;
valid2 = valid2 || _valid1;
const _errs15 = errors;
if(data3 !== null){
const err4 = {instancePath:instancePath+"/snapshot",schemaPath:"#/properties/snapshot/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
var _valid1 = _errs15 === errors;
valid2 = valid2 || _valid1;
if(!valid2){
const err5 = {instancePath:instancePath+"/snapshot",schemaPath:"#/properties/snapshot/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
validate143.errors = vErrors;
return false;
}
else {
errors = _errs13;
if(vErrors !== null){
if(_errs13){
vErrors.length = _errs13;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate143.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate143.errors = vErrors;
return errors === 0;
}
validate143.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate142(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate142.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.v === undefined) && (missing0 = "v")) || ((data.eventId === undefined) && (missing0 = "eventId"))) || ((data.serverTimeMs === undefined) && (missing0 = "serverTimeMs"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate142.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate142.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate142.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate142.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.eventId !== undefined){
let data1 = data.eventId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate142.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate142.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.serverTimeMs !== undefined){
let data2 = data.serverTimeMs;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate142.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate142.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate142.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playbackRevision !== undefined){
let data3 = data.playbackRevision;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate142.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate142.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate142.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.type !== undefined){
let data4 = data.type;
const _errs10 = errors;
if(typeof data4 !== "string"){
validate142.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("command.error" !== data4){
validate142.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "command.error"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.payload !== undefined){
const _errs12 = errors;
if(!(validate143(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate143.errors : vErrors.concat(validate143.errors);
errors = vErrors.length;
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate142.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate142.errors = vErrors;
return errors === 0;
}
validate142.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate88(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="urn:unison:server-event-v1" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate88.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
let valid0 = false;
let passing0 = null;
const _errs1 = errors;
if(!(validate89(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate89.errors : vErrors.concat(validate89.errors);
errors = vErrors.length;
}
var _valid0 = _errs1 === errors;
if(_valid0){
valid0 = true;
passing0 = 0;
var props0 = true;
}
const _errs2 = errors;
if(!(validate105(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate105.errors : vErrors.concat(validate105.errors);
errors = vErrors.length;
}
var _valid0 = _errs2 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid0 = true;
passing0 = 1;
if(props0 !== true){
props0 = true;
}
}
const _errs3 = errors;
if(!(validate108(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate108.errors : vErrors.concat(validate108.errors);
errors = vErrors.length;
}
var _valid0 = _errs3 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 2];
}
else {
if(_valid0){
valid0 = true;
passing0 = 2;
if(props0 !== true){
props0 = true;
}
}
const _errs4 = errors;
if(!(validate111(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate111.errors : vErrors.concat(validate111.errors);
errors = vErrors.length;
}
var _valid0 = _errs4 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 3];
}
else {
if(_valid0){
valid0 = true;
passing0 = 3;
if(props0 !== true){
props0 = true;
}
}
const _errs5 = errors;
if(!(validate115(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate115.errors : vErrors.concat(validate115.errors);
errors = vErrors.length;
}
var _valid0 = _errs5 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 4];
}
else {
if(_valid0){
valid0 = true;
passing0 = 4;
if(props0 !== true){
props0 = true;
}
}
const _errs6 = errors;
if(!(validate119(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate119.errors : vErrors.concat(validate119.errors);
errors = vErrors.length;
}
var _valid0 = _errs6 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 5];
}
else {
if(_valid0){
valid0 = true;
passing0 = 5;
if(props0 !== true){
props0 = true;
}
}
const _errs7 = errors;
if(!(validate124(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate124.errors : vErrors.concat(validate124.errors);
errors = vErrors.length;
}
var _valid0 = _errs7 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 6];
}
else {
if(_valid0){
valid0 = true;
passing0 = 6;
if(props0 !== true){
props0 = true;
}
}
const _errs8 = errors;
if(!(validate128(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate128.errors : vErrors.concat(validate128.errors);
errors = vErrors.length;
}
var _valid0 = _errs8 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 7];
}
else {
if(_valid0){
valid0 = true;
passing0 = 7;
if(props0 !== true){
props0 = true;
}
}
const _errs9 = errors;
if(!(validate134(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate134.errors : vErrors.concat(validate134.errors);
errors = vErrors.length;
}
var _valid0 = _errs9 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 8];
}
else {
if(_valid0){
valid0 = true;
passing0 = 8;
if(props0 !== true){
props0 = true;
}
}
const _errs10 = errors;
if(!(validate138(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate138.errors : vErrors.concat(validate138.errors);
errors = vErrors.length;
}
var _valid0 = _errs10 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 9];
}
else {
if(_valid0){
valid0 = true;
passing0 = 9;
if(props0 !== true){
props0 = true;
}
}
const _errs11 = errors;
if(!(validate142(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate142.errors : vErrors.concat(validate142.errors);
errors = vErrors.length;
}
var _valid0 = _errs11 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 10];
}
else {
if(_valid0){
valid0 = true;
passing0 = 10;
if(props0 !== true){
props0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
if(!valid0){
const err0 = {instancePath,schemaPath:"#/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
validate88.errors = vErrors;
return false;
}
else {
errors = _errs0;
if(vErrors !== null){
if(_errs0){
vErrors.length = _errs0;
}
else {
vErrors = null;
}
}
}
validate88.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate88.evaluated = {"dynamicProps":true,"dynamicItems":false};

export const httpBootstrap = validate204;
const schema66 = {"additionalProperties":false,"properties":{"csrfToken":{"title":"Csrftoken","type":"string"},"protocolVersion":{"const":1,"default":1,"title":"Protocolversion","type":"integer"},"limits":{"additionalProperties":{"type":"integer"},"title":"Limits","type":"object"}},"required":["csrfToken","limits"],"title":"Bootstrap","type":"object"};

function validate204(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate204.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.csrfToken === undefined) && (missing0 = "csrfToken")) || ((data.limits === undefined) && (missing0 = "limits"))){
validate204.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "csrfToken") || (key0 === "protocolVersion")) || (key0 === "limits"))){
validate204.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.csrfToken !== undefined){
const _errs2 = errors;
if(typeof data.csrfToken !== "string"){
validate204.errors = [{instancePath:instancePath+"/csrfToken",schemaPath:"#/properties/csrfToken/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.protocolVersion !== undefined){
let data1 = data.protocolVersion;
const _errs4 = errors;
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
validate204.errors = [{instancePath:instancePath+"/protocolVersion",schemaPath:"#/properties/protocolVersion/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data1){
validate204.errors = [{instancePath:instancePath+"/protocolVersion",schemaPath:"#/properties/protocolVersion/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.limits !== undefined){
let data2 = data.limits;
const _errs6 = errors;
if(errors === _errs6){
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
for(const key1 in data2){
let data3 = data2[key1];
const _errs9 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate204.errors = [{instancePath:instancePath+"/limits/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/limits/additionalProperties/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
var valid1 = _errs9 === errors;
if(!valid1){
break;
}
}
}
else {
validate204.errors = [{instancePath:instancePath+"/limits",schemaPath:"#/properties/limits/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate204.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate204.errors = vErrors;
return errors === 0;
}
validate204.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpCreateRoom = validate205;
const schema67 = {"additionalProperties":false,"properties":{"displayName":{"maxLength":32,"minLength":1,"title":"Displayname","type":"string"},"title":{"default":"Музыкальная комната","maxLength":64,"minLength":1,"title":"Title","type":"string"}},"required":["displayName"],"title":"CreateRoom","type":"object"};

function validate205(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate205.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.displayName === undefined) && (missing0 = "displayName")){
validate205.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "displayName") || (key0 === "title"))){
validate205.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.displayName !== undefined){
let data0 = data.displayName;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(func1(data0) > 32){
validate205.errors = [{instancePath:instancePath+"/displayName",schemaPath:"#/properties/displayName/maxLength",keyword:"maxLength",params:{limit: 32},message:"must NOT have more than 32 characters"}];
return false;
}
else {
if(func1(data0) < 1){
validate205.errors = [{instancePath:instancePath+"/displayName",schemaPath:"#/properties/displayName/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate205.errors = [{instancePath:instancePath+"/displayName",schemaPath:"#/properties/displayName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.title !== undefined){
let data1 = data.title;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(func1(data1) > 64){
validate205.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/maxLength",keyword:"maxLength",params:{limit: 64},message:"must NOT have more than 64 characters"}];
return false;
}
else {
if(func1(data1) < 1){
validate205.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate205.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate205.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate205.errors = vErrors;
return errors === 0;
}
validate205.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpCreateRoomResult = validate206;
const schema68 = {"additionalProperties":false,"properties":{"roomId":{"format":"uuid","title":"Roomid","type":"string"},"participantId":{"format":"uuid","title":"Participantid","type":"string"},"inviteUrl":{"title":"Inviteurl","type":"string"},"expiresAt":{"maximum":9007199254740991,"minimum":0,"title":"Expiresat","type":"integer"},"snapshot":{"$ref":"#/$defs/Snapshot"}},"required":["roomId","participantId","inviteUrl","expiresAt","snapshot"],"title":"CreateRoomResult","type":"object"};
const schema69 = {"additionalProperties":false,"properties":{"room":{"$ref":"#/$defs/Room"},"participants":{"items":{"$ref":"#/$defs/Participant"},"title":"Participants","type":"array"},"playback":{"$ref":"#/$defs/Playback"},"presenceSeq":{"maximum":9007199254740991,"minimum":0,"title":"Presenceseq","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"}},"required":["room","participants","playback","presenceSeq","playbackRevision"],"title":"Snapshot","type":"object"};
const schema70 = {"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"title":{"title":"Title","type":"string"},"status":{"enum":["active","closed","expired"],"title":"Status","type":"string"},"capacity":{"maximum":10,"minimum":2,"title":"Capacity","type":"integer"},"expiresAt":{"maximum":9007199254740991,"minimum":0,"title":"Expiresat","type":"integer"},"hostParticipantId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Hostparticipantid"}},"required":["id","title","status","capacity","expiresAt","hostParticipantId"],"title":"Room","type":"object"};

function validate154(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate154.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.id === undefined) && (missing0 = "id")) || ((data.title === undefined) && (missing0 = "title"))) || ((data.status === undefined) && (missing0 = "status"))) || ((data.capacity === undefined) && (missing0 = "capacity"))) || ((data.expiresAt === undefined) && (missing0 = "expiresAt"))) || ((data.hostParticipantId === undefined) && (missing0 = "hostParticipantId"))){
validate154.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "id") || (key0 === "title")) || (key0 === "status")) || (key0 === "capacity")) || (key0 === "expiresAt")) || (key0 === "hostParticipantId"))){
validate154.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate154.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate154.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.title !== undefined){
const _errs4 = errors;
if(typeof data.title !== "string"){
validate154.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
let data2 = data.status;
const _errs6 = errors;
if(typeof data2 !== "string"){
validate154.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data2 === "active") || (data2 === "closed")) || (data2 === "expired"))){
validate154.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema70.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.capacity !== undefined){
let data3 = data.capacity;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate154.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 10 || isNaN(data3)){
validate154.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10},message:"must be <= 10"}];
return false;
}
else {
if(data3 < 2 || isNaN(data3)){
validate154.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 2},message:"must be >= 2"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expiresAt !== undefined){
let data4 = data.expiresAt;
const _errs10 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate154.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs10){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate154.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 0 || isNaN(data4)){
validate154.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.hostParticipantId !== undefined){
let data5 = data.hostParticipantId;
const _errs12 = errors;
const _errs13 = errors;
let valid1 = false;
const _errs14 = errors;
if(errors === _errs14){
if(errors === _errs14){
if(typeof data5 === "string"){
if(!(formats0.test(data5))){
const err0 = {instancePath:instancePath+"/hostParticipantId",schemaPath:"#/properties/hostParticipantId/anyOf/0/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
else {
const err1 = {instancePath:instancePath+"/hostParticipantId",schemaPath:"#/properties/hostParticipantId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
var _valid0 = _errs14 === errors;
valid1 = valid1 || _valid0;
const _errs16 = errors;
if(data5 !== null){
const err2 = {instancePath:instancePath+"/hostParticipantId",schemaPath:"#/properties/hostParticipantId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs16 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err3 = {instancePath:instancePath+"/hostParticipantId",schemaPath:"#/properties/hostParticipantId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
validate154.errors = vErrors;
return false;
}
else {
errors = _errs13;
if(vErrors !== null){
if(_errs13){
vErrors.length = _errs13;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate154.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate154.errors = vErrors;
return errors === 0;
}
validate154.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema71 = {"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"displayName":{"title":"Displayname","type":"string"},"role":{"enum":["host","listener"],"title":"Role","type":"string"},"connectionState":{"enum":["online","offline","connecting"],"title":"Connectionstate","type":"string"},"readiness":{"anyOf":[{"$ref":"#/$defs/Readiness"},{"type":"null"}]}},"required":["id","displayName","role","connectionState","readiness"],"title":"Participant","type":"object"};
const schema72 = {"additionalProperties":false,"properties":{"trackId":{"format":"uuid","title":"Trackid","type":"string"},"mediaVersion":{"maxLength":128,"minLength":1,"title":"Mediaversion","type":"string"},"state":{"enum":["loading","ready","buffering","autoplayBlocked","error"],"title":"State","type":"string"},"bufferedAheadMs":{"maximum":900000,"minimum":0,"title":"Bufferedaheadms","type":"integer"},"autoplayAllowed":{"title":"Autoplayallowed","type":"boolean"}},"required":["trackId","mediaVersion","state","bufferedAheadMs","autoplayAllowed"],"title":"Readiness","type":"object"};

function validate157(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate157.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.trackId === undefined) && (missing0 = "trackId")) || ((data.mediaVersion === undefined) && (missing0 = "mediaVersion"))) || ((data.state === undefined) && (missing0 = "state"))) || ((data.bufferedAheadMs === undefined) && (missing0 = "bufferedAheadMs"))) || ((data.autoplayAllowed === undefined) && (missing0 = "autoplayAllowed"))){
validate157.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "trackId") || (key0 === "mediaVersion")) || (key0 === "state")) || (key0 === "bufferedAheadMs")) || (key0 === "autoplayAllowed"))){
validate157.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.trackId !== undefined){
let data0 = data.trackId;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate157.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate157.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mediaVersion !== undefined){
let data1 = data.mediaVersion;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(func1(data1) > 128){
validate157.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/maxLength",keyword:"maxLength",params:{limit: 128},message:"must NOT have more than 128 characters"}];
return false;
}
else {
if(func1(data1) < 1){
validate157.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate157.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.state !== undefined){
let data2 = data.state;
const _errs6 = errors;
if(typeof data2 !== "string"){
validate157.errors = [{instancePath:instancePath+"/state",schemaPath:"#/properties/state/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((((data2 === "loading") || (data2 === "ready")) || (data2 === "buffering")) || (data2 === "autoplayBlocked")) || (data2 === "error"))){
validate157.errors = [{instancePath:instancePath+"/state",schemaPath:"#/properties/state/enum",keyword:"enum",params:{allowedValues: schema72.properties.state.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.bufferedAheadMs !== undefined){
let data3 = data.bufferedAheadMs;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate157.errors = [{instancePath:instancePath+"/bufferedAheadMs",schemaPath:"#/properties/bufferedAheadMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 900000 || isNaN(data3)){
validate157.errors = [{instancePath:instancePath+"/bufferedAheadMs",schemaPath:"#/properties/bufferedAheadMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate157.errors = [{instancePath:instancePath+"/bufferedAheadMs",schemaPath:"#/properties/bufferedAheadMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.autoplayAllowed !== undefined){
const _errs10 = errors;
if(typeof data.autoplayAllowed !== "boolean"){
validate157.errors = [{instancePath:instancePath+"/autoplayAllowed",schemaPath:"#/properties/autoplayAllowed/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate157.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate157.errors = vErrors;
return errors === 0;
}
validate157.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate156(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate156.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.id === undefined) && (missing0 = "id")) || ((data.displayName === undefined) && (missing0 = "displayName"))) || ((data.role === undefined) && (missing0 = "role"))) || ((data.connectionState === undefined) && (missing0 = "connectionState"))) || ((data.readiness === undefined) && (missing0 = "readiness"))){
validate156.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "id") || (key0 === "displayName")) || (key0 === "role")) || (key0 === "connectionState")) || (key0 === "readiness"))){
validate156.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate156.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate156.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.displayName !== undefined){
const _errs4 = errors;
if(typeof data.displayName !== "string"){
validate156.errors = [{instancePath:instancePath+"/displayName",schemaPath:"#/properties/displayName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.role !== undefined){
let data2 = data.role;
const _errs6 = errors;
if(typeof data2 !== "string"){
validate156.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((data2 === "host") || (data2 === "listener"))){
validate156.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/enum",keyword:"enum",params:{allowedValues: schema71.properties.role.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.connectionState !== undefined){
let data3 = data.connectionState;
const _errs8 = errors;
if(typeof data3 !== "string"){
validate156.errors = [{instancePath:instancePath+"/connectionState",schemaPath:"#/properties/connectionState/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data3 === "online") || (data3 === "offline")) || (data3 === "connecting"))){
validate156.errors = [{instancePath:instancePath+"/connectionState",schemaPath:"#/properties/connectionState/enum",keyword:"enum",params:{allowedValues: schema71.properties.connectionState.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.readiness !== undefined){
let data4 = data.readiness;
const _errs10 = errors;
const _errs11 = errors;
let valid1 = false;
const _errs12 = errors;
if(!(validate157(data4, {instancePath:instancePath+"/readiness",parentData:data,parentDataProperty:"readiness",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate157.errors : vErrors.concat(validate157.errors);
errors = vErrors.length;
}
var _valid0 = _errs12 === errors;
valid1 = valid1 || _valid0;
const _errs13 = errors;
if(data4 !== null){
const err0 = {instancePath:instancePath+"/readiness",schemaPath:"#/properties/readiness/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
var _valid0 = _errs13 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err1 = {instancePath:instancePath+"/readiness",schemaPath:"#/properties/readiness/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
validate156.errors = vErrors;
return false;
}
else {
errors = _errs11;
if(vErrors !== null){
if(_errs11){
vErrors.length = _errs11;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate156.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate156.errors = vErrors;
return errors === 0;
}
validate156.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema73 = {"additionalProperties":false,"properties":{"roomId":{"format":"uuid","title":"Roomid","type":"string"},"epoch":{"format":"uuid","title":"Epoch","type":"string"},"trackId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Trackid"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Mediaversion"},"status":{"enum":["empty","paused","playing","ended"],"title":"Status","type":"string"},"positionMs":{"maximum":900000,"minimum":0,"title":"Positionms","type":"integer"},"anchorServerTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Anchorservertimems","type":"integer"},"durationMs":{"maximum":900000,"minimum":0,"title":"Durationms","type":"integer"},"pendingTransition":{"anyOf":[{"$ref":"#/$defs/PendingTransition"},{"type":"null"}]}},"required":["roomId","epoch","trackId","mediaVersion","status","positionMs","anchorServerTimeMs","durationMs","pendingTransition"],"title":"Playback","type":"object"};
const schema74 = {"additionalProperties":false,"properties":{"type":{"enum":["play","pause","seek"],"title":"Type","type":"string"},"nextStatus":{"enum":["paused","playing","ended"],"title":"Nextstatus","type":"string"},"positionMs":{"maximum":900000,"minimum":0,"title":"Positionms","type":"integer"},"effectiveAtServerTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Effectiveatservertimems","type":"integer"},"trackId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"default":null,"title":"Trackid"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Mediaversion"}},"required":["type","nextStatus","positionMs","effectiveAtServerTimeMs"],"title":"PendingTransition","type":"object"};

function validate161(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate161.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.type === undefined) && (missing0 = "type")) || ((data.nextStatus === undefined) && (missing0 = "nextStatus"))) || ((data.positionMs === undefined) && (missing0 = "positionMs"))) || ((data.effectiveAtServerTimeMs === undefined) && (missing0 = "effectiveAtServerTimeMs"))){
validate161.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "nextStatus")) || (key0 === "positionMs")) || (key0 === "effectiveAtServerTimeMs")) || (key0 === "trackId")) || (key0 === "mediaVersion"))){
validate161.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
const _errs2 = errors;
if(typeof data0 !== "string"){
validate161.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data0 === "play") || (data0 === "pause")) || (data0 === "seek"))){
validate161.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/enum",keyword:"enum",params:{allowedValues: schema74.properties.type.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nextStatus !== undefined){
let data1 = data.nextStatus;
const _errs4 = errors;
if(typeof data1 !== "string"){
validate161.errors = [{instancePath:instancePath+"/nextStatus",schemaPath:"#/properties/nextStatus/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data1 === "paused") || (data1 === "playing")) || (data1 === "ended"))){
validate161.errors = [{instancePath:instancePath+"/nextStatus",schemaPath:"#/properties/nextStatus/enum",keyword:"enum",params:{allowedValues: schema74.properties.nextStatus.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.positionMs !== undefined){
let data2 = data.positionMs;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate161.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 900000 || isNaN(data2)){
validate161.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate161.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.effectiveAtServerTimeMs !== undefined){
let data3 = data.effectiveAtServerTimeMs;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate161.errors = [{instancePath:instancePath+"/effectiveAtServerTimeMs",schemaPath:"#/properties/effectiveAtServerTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate161.errors = [{instancePath:instancePath+"/effectiveAtServerTimeMs",schemaPath:"#/properties/effectiveAtServerTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate161.errors = [{instancePath:instancePath+"/effectiveAtServerTimeMs",schemaPath:"#/properties/effectiveAtServerTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.trackId !== undefined){
let data4 = data.trackId;
const _errs10 = errors;
const _errs11 = errors;
let valid1 = false;
const _errs12 = errors;
if(errors === _errs12){
if(errors === _errs12){
if(typeof data4 === "string"){
if(!(formats0.test(data4))){
const err0 = {instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/anyOf/0/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
else {
const err1 = {instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
var _valid0 = _errs12 === errors;
valid1 = valid1 || _valid0;
const _errs14 = errors;
if(data4 !== null){
const err2 = {instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs14 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err3 = {instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
validate161.errors = vErrors;
return false;
}
else {
errors = _errs11;
if(vErrors !== null){
if(_errs11){
vErrors.length = _errs11;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mediaVersion !== undefined){
let data5 = data.mediaVersion;
const _errs16 = errors;
const _errs17 = errors;
let valid2 = false;
const _errs18 = errors;
if(typeof data5 !== "string"){
const err4 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
var _valid1 = _errs18 === errors;
valid2 = valid2 || _valid1;
const _errs20 = errors;
if(data5 !== null){
const err5 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
var _valid1 = _errs20 === errors;
valid2 = valid2 || _valid1;
if(!valid2){
const err6 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
validate161.errors = vErrors;
return false;
}
else {
errors = _errs17;
if(vErrors !== null){
if(_errs17){
vErrors.length = _errs17;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate161.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate161.errors = vErrors;
return errors === 0;
}
validate161.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate160(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate160.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((((data.roomId === undefined) && (missing0 = "roomId")) || ((data.epoch === undefined) && (missing0 = "epoch"))) || ((data.trackId === undefined) && (missing0 = "trackId"))) || ((data.mediaVersion === undefined) && (missing0 = "mediaVersion"))) || ((data.status === undefined) && (missing0 = "status"))) || ((data.positionMs === undefined) && (missing0 = "positionMs"))) || ((data.anchorServerTimeMs === undefined) && (missing0 = "anchorServerTimeMs"))) || ((data.durationMs === undefined) && (missing0 = "durationMs"))) || ((data.pendingTransition === undefined) && (missing0 = "pendingTransition"))){
validate160.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema73.properties, key0))){
validate160.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.roomId !== undefined){
let data0 = data.roomId;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate160.errors = [{instancePath:instancePath+"/roomId",schemaPath:"#/properties/roomId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate160.errors = [{instancePath:instancePath+"/roomId",schemaPath:"#/properties/roomId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.epoch !== undefined){
let data1 = data.epoch;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate160.errors = [{instancePath:instancePath+"/epoch",schemaPath:"#/properties/epoch/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate160.errors = [{instancePath:instancePath+"/epoch",schemaPath:"#/properties/epoch/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.trackId !== undefined){
let data2 = data.trackId;
const _errs6 = errors;
const _errs7 = errors;
let valid1 = false;
const _errs8 = errors;
if(errors === _errs8){
if(errors === _errs8){
if(typeof data2 === "string"){
if(!(formats0.test(data2))){
const err0 = {instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/anyOf/0/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
else {
const err1 = {instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
var _valid0 = _errs8 === errors;
valid1 = valid1 || _valid0;
const _errs10 = errors;
if(data2 !== null){
const err2 = {instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs10 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err3 = {instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
validate160.errors = vErrors;
return false;
}
else {
errors = _errs7;
if(vErrors !== null){
if(_errs7){
vErrors.length = _errs7;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mediaVersion !== undefined){
let data3 = data.mediaVersion;
const _errs12 = errors;
const _errs13 = errors;
let valid2 = false;
const _errs14 = errors;
if(typeof data3 !== "string"){
const err4 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
var _valid1 = _errs14 === errors;
valid2 = valid2 || _valid1;
const _errs16 = errors;
if(data3 !== null){
const err5 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
var _valid1 = _errs16 === errors;
valid2 = valid2 || _valid1;
if(!valid2){
const err6 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
validate160.errors = vErrors;
return false;
}
else {
errors = _errs13;
if(vErrors !== null){
if(_errs13){
vErrors.length = _errs13;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
let data4 = data.status;
const _errs18 = errors;
if(typeof data4 !== "string"){
validate160.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((((data4 === "empty") || (data4 === "paused")) || (data4 === "playing")) || (data4 === "ended"))){
validate160.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema73.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.positionMs !== undefined){
let data5 = data.positionMs;
const _errs20 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate160.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs20){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 900000 || isNaN(data5)){
validate160.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate160.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs20 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.anchorServerTimeMs !== undefined){
let data6 = data.anchorServerTimeMs;
const _errs22 = errors;
if(!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))){
validate160.errors = [{instancePath:instancePath+"/anchorServerTimeMs",schemaPath:"#/properties/anchorServerTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs22){
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 > 9007199254740991 || isNaN(data6)){
validate160.errors = [{instancePath:instancePath+"/anchorServerTimeMs",schemaPath:"#/properties/anchorServerTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data6 < 0 || isNaN(data6)){
validate160.errors = [{instancePath:instancePath+"/anchorServerTimeMs",schemaPath:"#/properties/anchorServerTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs22 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.durationMs !== undefined){
let data7 = data.durationMs;
const _errs24 = errors;
if(!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))){
validate160.errors = [{instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs24){
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 > 900000 || isNaN(data7)){
validate160.errors = [{instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data7 < 0 || isNaN(data7)){
validate160.errors = [{instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs24 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.pendingTransition !== undefined){
let data8 = data.pendingTransition;
const _errs26 = errors;
const _errs27 = errors;
let valid3 = false;
const _errs28 = errors;
if(!(validate161(data8, {instancePath:instancePath+"/pendingTransition",parentData:data,parentDataProperty:"pendingTransition",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate161.errors : vErrors.concat(validate161.errors);
errors = vErrors.length;
}
var _valid2 = _errs28 === errors;
valid3 = valid3 || _valid2;
const _errs29 = errors;
if(data8 !== null){
const err7 = {instancePath:instancePath+"/pendingTransition",schemaPath:"#/properties/pendingTransition/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
var _valid2 = _errs29 === errors;
valid3 = valid3 || _valid2;
if(!valid3){
const err8 = {instancePath:instancePath+"/pendingTransition",schemaPath:"#/properties/pendingTransition/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
validate160.errors = vErrors;
return false;
}
else {
errors = _errs27;
if(vErrors !== null){
if(_errs27){
vErrors.length = _errs27;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs26 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate160.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate160.errors = vErrors;
return errors === 0;
}
validate160.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate153(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate153.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.room === undefined) && (missing0 = "room")) || ((data.participants === undefined) && (missing0 = "participants"))) || ((data.playback === undefined) && (missing0 = "playback"))) || ((data.presenceSeq === undefined) && (missing0 = "presenceSeq"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))){
validate153.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "room") || (key0 === "participants")) || (key0 === "playback")) || (key0 === "presenceSeq")) || (key0 === "playbackRevision"))){
validate153.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.room !== undefined){
const _errs2 = errors;
if(!(validate154(data.room, {instancePath:instancePath+"/room",parentData:data,parentDataProperty:"room",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate154.errors : vErrors.concat(validate154.errors);
errors = vErrors.length;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.participants !== undefined){
let data1 = data.participants;
const _errs3 = errors;
if(errors === _errs3){
if(Array.isArray(data1)){
var valid1 = true;
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
const _errs5 = errors;
if(!(validate156(data1[i0], {instancePath:instancePath+"/participants/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate156.errors : vErrors.concat(validate156.errors);
errors = vErrors.length;
}
var valid1 = _errs5 === errors;
if(!valid1){
break;
}
}
}
else {
validate153.errors = [{instancePath:instancePath+"/participants",schemaPath:"#/properties/participants/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playback !== undefined){
const _errs6 = errors;
if(!(validate160(data.playback, {instancePath:instancePath+"/playback",parentData:data,parentDataProperty:"playback",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate160.errors : vErrors.concat(validate160.errors);
errors = vErrors.length;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.presenceSeq !== undefined){
let data4 = data.presenceSeq;
const _errs7 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate153.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs7){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate153.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 0 || isNaN(data4)){
validate153.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playbackRevision !== undefined){
let data5 = data.playbackRevision;
const _errs9 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate153.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 9007199254740991 || isNaN(data5)){
validate153.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate153.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate153.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate153.errors = vErrors;
return errors === 0;
}
validate153.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate206(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate206.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.roomId === undefined) && (missing0 = "roomId")) || ((data.participantId === undefined) && (missing0 = "participantId"))) || ((data.inviteUrl === undefined) && (missing0 = "inviteUrl"))) || ((data.expiresAt === undefined) && (missing0 = "expiresAt"))) || ((data.snapshot === undefined) && (missing0 = "snapshot"))){
validate206.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "roomId") || (key0 === "participantId")) || (key0 === "inviteUrl")) || (key0 === "expiresAt")) || (key0 === "snapshot"))){
validate206.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.roomId !== undefined){
let data0 = data.roomId;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate206.errors = [{instancePath:instancePath+"/roomId",schemaPath:"#/properties/roomId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate206.errors = [{instancePath:instancePath+"/roomId",schemaPath:"#/properties/roomId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.participantId !== undefined){
let data1 = data.participantId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate206.errors = [{instancePath:instancePath+"/participantId",schemaPath:"#/properties/participantId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate206.errors = [{instancePath:instancePath+"/participantId",schemaPath:"#/properties/participantId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.inviteUrl !== undefined){
const _errs6 = errors;
if(typeof data.inviteUrl !== "string"){
validate206.errors = [{instancePath:instancePath+"/inviteUrl",schemaPath:"#/properties/inviteUrl/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expiresAt !== undefined){
let data3 = data.expiresAt;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate206.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate206.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate206.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.snapshot !== undefined){
const _errs10 = errors;
if(!(validate153(data.snapshot, {instancePath:instancePath+"/snapshot",parentData:data,parentDataProperty:"snapshot",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate153.errors : vErrors.concat(validate153.errors);
errors = vErrors.length;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate206.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate206.errors = vErrors;
return errors === 0;
}
validate206.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpPreviewInvite = validate208;
const schema75 = {"additionalProperties":false,"properties":{"inviteToken":{"maxLength":43,"minLength":43,"pattern":"^[A-Za-z0-9_-]+$","title":"Invitetoken","type":"string"}},"required":["inviteToken"],"title":"PreviewInvite","type":"object"};
const pattern3 = new RegExp("^[A-Za-z0-9_-]+$", "u");

function validate208(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate208.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.inviteToken === undefined) && (missing0 = "inviteToken")){
validate208.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "inviteToken")){
validate208.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.inviteToken !== undefined){
let data0 = data.inviteToken;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(func1(data0) > 43){
validate208.errors = [{instancePath:instancePath+"/inviteToken",schemaPath:"#/properties/inviteToken/maxLength",keyword:"maxLength",params:{limit: 43},message:"must NOT have more than 43 characters"}];
return false;
}
else {
if(func1(data0) < 43){
validate208.errors = [{instancePath:instancePath+"/inviteToken",schemaPath:"#/properties/inviteToken/minLength",keyword:"minLength",params:{limit: 43},message:"must NOT have fewer than 43 characters"}];
return false;
}
else {
if(!pattern3.test(data0)){
validate208.errors = [{instancePath:instancePath+"/inviteToken",schemaPath:"#/properties/inviteToken/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z0-9_-]+$"},message:"must match pattern \""+"^[A-Za-z0-9_-]+$"+"\""}];
return false;
}
}
}
}
else {
validate208.errors = [{instancePath:instancePath+"/inviteToken",schemaPath:"#/properties/inviteToken/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
}
}
}
else {
validate208.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate208.errors = vErrors;
return errors === 0;
}
validate208.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpPreviewResult = validate209;
const schema76 = {"additionalProperties":false,"properties":{"roomId":{"format":"uuid","title":"Roomid","type":"string"},"title":{"title":"Title","type":"string"},"status":{"enum":["active","closed","expired"],"title":"Status","type":"string"},"participantCount":{"maximum":10,"minimum":0,"title":"Participantcount","type":"integer"},"capacity":{"maximum":10,"minimum":2,"title":"Capacity","type":"integer"},"expiresAt":{"maximum":9007199254740991,"minimum":0,"title":"Expiresat","type":"integer"}},"required":["roomId","title","status","participantCount","capacity","expiresAt"],"title":"PreviewResult","type":"object"};

function validate209(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate209.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((((data.roomId === undefined) && (missing0 = "roomId")) || ((data.title === undefined) && (missing0 = "title"))) || ((data.status === undefined) && (missing0 = "status"))) || ((data.participantCount === undefined) && (missing0 = "participantCount"))) || ((data.capacity === undefined) && (missing0 = "capacity"))) || ((data.expiresAt === undefined) && (missing0 = "expiresAt"))){
validate209.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "roomId") || (key0 === "title")) || (key0 === "status")) || (key0 === "participantCount")) || (key0 === "capacity")) || (key0 === "expiresAt"))){
validate209.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.roomId !== undefined){
let data0 = data.roomId;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate209.errors = [{instancePath:instancePath+"/roomId",schemaPath:"#/properties/roomId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate209.errors = [{instancePath:instancePath+"/roomId",schemaPath:"#/properties/roomId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.title !== undefined){
const _errs4 = errors;
if(typeof data.title !== "string"){
validate209.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
let data2 = data.status;
const _errs6 = errors;
if(typeof data2 !== "string"){
validate209.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data2 === "active") || (data2 === "closed")) || (data2 === "expired"))){
validate209.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema76.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.participantCount !== undefined){
let data3 = data.participantCount;
const _errs8 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
validate209.errors = [{instancePath:instancePath+"/participantCount",schemaPath:"#/properties/participantCount/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 10 || isNaN(data3)){
validate209.errors = [{instancePath:instancePath+"/participantCount",schemaPath:"#/properties/participantCount/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10},message:"must be <= 10"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate209.errors = [{instancePath:instancePath+"/participantCount",schemaPath:"#/properties/participantCount/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.capacity !== undefined){
let data4 = data.capacity;
const _errs10 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate209.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs10){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 10 || isNaN(data4)){
validate209.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10},message:"must be <= 10"}];
return false;
}
else {
if(data4 < 2 || isNaN(data4)){
validate209.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 2},message:"must be >= 2"}];
return false;
}
}
}
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expiresAt !== undefined){
let data5 = data.expiresAt;
const _errs12 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate209.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs12){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 9007199254740991 || isNaN(data5)){
validate209.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate209.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate209.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate209.errors = vErrors;
return errors === 0;
}
validate209.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpJoinRoom = validate210;
const schema77 = {"additionalProperties":false,"properties":{"inviteToken":{"maxLength":43,"minLength":43,"pattern":"^[A-Za-z0-9_-]+$","title":"Invitetoken","type":"string"},"displayName":{"maxLength":32,"minLength":1,"title":"Displayname","type":"string"}},"required":["inviteToken","displayName"],"title":"JoinRoom","type":"object"};

function validate210(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate210.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.inviteToken === undefined) && (missing0 = "inviteToken")) || ((data.displayName === undefined) && (missing0 = "displayName"))){
validate210.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "inviteToken") || (key0 === "displayName"))){
validate210.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.inviteToken !== undefined){
let data0 = data.inviteToken;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(func1(data0) > 43){
validate210.errors = [{instancePath:instancePath+"/inviteToken",schemaPath:"#/properties/inviteToken/maxLength",keyword:"maxLength",params:{limit: 43},message:"must NOT have more than 43 characters"}];
return false;
}
else {
if(func1(data0) < 43){
validate210.errors = [{instancePath:instancePath+"/inviteToken",schemaPath:"#/properties/inviteToken/minLength",keyword:"minLength",params:{limit: 43},message:"must NOT have fewer than 43 characters"}];
return false;
}
else {
if(!pattern3.test(data0)){
validate210.errors = [{instancePath:instancePath+"/inviteToken",schemaPath:"#/properties/inviteToken/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z0-9_-]+$"},message:"must match pattern \""+"^[A-Za-z0-9_-]+$"+"\""}];
return false;
}
}
}
}
else {
validate210.errors = [{instancePath:instancePath+"/inviteToken",schemaPath:"#/properties/inviteToken/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.displayName !== undefined){
let data1 = data.displayName;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data1 === "string"){
if(func1(data1) > 32){
validate210.errors = [{instancePath:instancePath+"/displayName",schemaPath:"#/properties/displayName/maxLength",keyword:"maxLength",params:{limit: 32},message:"must NOT have more than 32 characters"}];
return false;
}
else {
if(func1(data1) < 1){
validate210.errors = [{instancePath:instancePath+"/displayName",schemaPath:"#/properties/displayName/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate210.errors = [{instancePath:instancePath+"/displayName",schemaPath:"#/properties/displayName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate210.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate210.errors = vErrors;
return errors === 0;
}
validate210.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpJoinRoomResult = validate211;
const schema78 = {"additionalProperties":false,"properties":{"participantId":{"format":"uuid","title":"Participantid","type":"string"},"role":{"enum":["host","listener"],"title":"Role","type":"string"},"snapshot":{"$ref":"#/$defs/Snapshot"}},"required":["participantId","role","snapshot"],"title":"JoinRoomResult","type":"object"};

function validate211(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate211.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.participantId === undefined) && (missing0 = "participantId")) || ((data.role === undefined) && (missing0 = "role"))) || ((data.snapshot === undefined) && (missing0 = "snapshot"))){
validate211.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "participantId") || (key0 === "role")) || (key0 === "snapshot"))){
validate211.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.participantId !== undefined){
let data0 = data.participantId;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate211.errors = [{instancePath:instancePath+"/participantId",schemaPath:"#/properties/participantId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate211.errors = [{instancePath:instancePath+"/participantId",schemaPath:"#/properties/participantId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.role !== undefined){
let data1 = data.role;
const _errs4 = errors;
if(typeof data1 !== "string"){
validate211.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((data1 === "host") || (data1 === "listener"))){
validate211.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/enum",keyword:"enum",params:{allowedValues: schema78.properties.role.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.snapshot !== undefined){
const _errs6 = errors;
if(!(validate153(data.snapshot, {instancePath:instancePath+"/snapshot",parentData:data,parentDataProperty:"snapshot",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate153.errors : vErrors.concat(validate153.errors);
errors = vErrors.length;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate211.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate211.errors = vErrors;
return errors === 0;
}
validate211.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpCloseRoom = validate213;
const schema79 = {"additionalProperties":false,"properties":{"expectedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Expectedplaybackrevision","type":"integer"}},"required":["expectedPlaybackRevision"],"title":"CloseRoom","type":"object"};

function validate213(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate213.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.expectedPlaybackRevision === undefined) && (missing0 = "expectedPlaybackRevision")){
validate213.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "expectedPlaybackRevision")){
validate213.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.expectedPlaybackRevision !== undefined){
let data0 = data.expectedPlaybackRevision;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate213.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs2){
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 > 9007199254740991 || isNaN(data0)){
validate213.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data0 < 0 || isNaN(data0)){
validate213.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
}
}
}
}
else {
validate213.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate213.errors = vErrors;
return errors === 0;
}
validate213.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpSnapshot = validate214;

function validate214(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate214.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.room === undefined) && (missing0 = "room")) || ((data.participants === undefined) && (missing0 = "participants"))) || ((data.playback === undefined) && (missing0 = "playback"))) || ((data.presenceSeq === undefined) && (missing0 = "presenceSeq"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))){
validate214.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "room") || (key0 === "participants")) || (key0 === "playback")) || (key0 === "presenceSeq")) || (key0 === "playbackRevision"))){
validate214.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.room !== undefined){
const _errs2 = errors;
if(!(validate154(data.room, {instancePath:instancePath+"/room",parentData:data,parentDataProperty:"room",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate154.errors : vErrors.concat(validate154.errors);
errors = vErrors.length;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.participants !== undefined){
let data1 = data.participants;
const _errs3 = errors;
if(errors === _errs3){
if(Array.isArray(data1)){
var valid1 = true;
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
const _errs5 = errors;
if(!(validate156(data1[i0], {instancePath:instancePath+"/participants/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate156.errors : vErrors.concat(validate156.errors);
errors = vErrors.length;
}
var valid1 = _errs5 === errors;
if(!valid1){
break;
}
}
}
else {
validate214.errors = [{instancePath:instancePath+"/participants",schemaPath:"#/properties/participants/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playback !== undefined){
const _errs6 = errors;
if(!(validate160(data.playback, {instancePath:instancePath+"/playback",parentData:data,parentDataProperty:"playback",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate160.errors : vErrors.concat(validate160.errors);
errors = vErrors.length;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.presenceSeq !== undefined){
let data4 = data.presenceSeq;
const _errs7 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate214.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs7){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate214.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 0 || isNaN(data4)){
validate214.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.playbackRevision !== undefined){
let data5 = data.playbackRevision;
const _errs9 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate214.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 9007199254740991 || isNaN(data5)){
validate214.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate214.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate214.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate214.errors = vErrors;
return errors === 0;
}
validate214.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpInviteResult = validate218;
const schema80 = {"additionalProperties":false,"properties":{"inviteUrl":{"title":"Inviteurl","type":"string"},"expiresAt":{"maximum":9007199254740991,"minimum":0,"title":"Expiresat","type":"integer"}},"required":["inviteUrl","expiresAt"],"title":"InviteResult","type":"object"};

function validate218(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate218.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.inviteUrl === undefined) && (missing0 = "inviteUrl")) || ((data.expiresAt === undefined) && (missing0 = "expiresAt"))){
validate218.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "inviteUrl") || (key0 === "expiresAt"))){
validate218.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.inviteUrl !== undefined){
const _errs2 = errors;
if(typeof data.inviteUrl !== "string"){
validate218.errors = [{instancePath:instancePath+"/inviteUrl",schemaPath:"#/properties/inviteUrl/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expiresAt !== undefined){
let data1 = data.expiresAt;
const _errs4 = errors;
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
validate218.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs4){
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 > 9007199254740991 || isNaN(data1)){
validate218.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data1 < 0 || isNaN(data1)){
validate218.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate218.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate218.errors = vErrors;
return errors === 0;
}
validate218.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpReserveUpload = validate219;
const schema81 = {"additionalProperties":false,"properties":{"fileName":{"maxLength":200,"minLength":1,"title":"Filename","type":"string"},"contentType":{"enum":["audio/mpeg","audio/wav","audio/x-wav","audio/mp4","audio/x-m4a"],"title":"Contenttype","type":"string"},"sizeBytes":{"exclusiveMinimum":0,"maximum":52428800,"title":"Sizebytes","type":"integer"}},"required":["fileName","contentType","sizeBytes"],"title":"ReserveUpload","type":"object"};

function validate219(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate219.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.fileName === undefined) && (missing0 = "fileName")) || ((data.contentType === undefined) && (missing0 = "contentType"))) || ((data.sizeBytes === undefined) && (missing0 = "sizeBytes"))){
validate219.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "fileName") || (key0 === "contentType")) || (key0 === "sizeBytes"))){
validate219.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.fileName !== undefined){
let data0 = data.fileName;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(func1(data0) > 200){
validate219.errors = [{instancePath:instancePath+"/fileName",schemaPath:"#/properties/fileName/maxLength",keyword:"maxLength",params:{limit: 200},message:"must NOT have more than 200 characters"}];
return false;
}
else {
if(func1(data0) < 1){
validate219.errors = [{instancePath:instancePath+"/fileName",schemaPath:"#/properties/fileName/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate219.errors = [{instancePath:instancePath+"/fileName",schemaPath:"#/properties/fileName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.contentType !== undefined){
let data1 = data.contentType;
const _errs4 = errors;
if(typeof data1 !== "string"){
validate219.errors = [{instancePath:instancePath+"/contentType",schemaPath:"#/properties/contentType/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((((data1 === "audio/mpeg") || (data1 === "audio/wav")) || (data1 === "audio/x-wav")) || (data1 === "audio/mp4")) || (data1 === "audio/x-m4a"))){
validate219.errors = [{instancePath:instancePath+"/contentType",schemaPath:"#/properties/contentType/enum",keyword:"enum",params:{allowedValues: schema81.properties.contentType.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sizeBytes !== undefined){
let data2 = data.sizeBytes;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate219.errors = [{instancePath:instancePath+"/sizeBytes",schemaPath:"#/properties/sizeBytes/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 52428800 || isNaN(data2)){
validate219.errors = [{instancePath:instancePath+"/sizeBytes",schemaPath:"#/properties/sizeBytes/maximum",keyword:"maximum",params:{comparison: "<=", limit: 52428800},message:"must be <= 52428800"}];
return false;
}
else {
if(data2 <= 0 || isNaN(data2)){
validate219.errors = [{instancePath:instancePath+"/sizeBytes",schemaPath:"#/properties/sizeBytes/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"}];
return false;
}
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate219.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate219.errors = vErrors;
return errors === 0;
}
validate219.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpReserveUploadResult = validate220;
const schema82 = {"additionalProperties":false,"properties":{"uploadId":{"format":"uuid","title":"Uploadid","type":"string"},"uploadUrl":{"title":"Uploadurl","type":"string"},"requiredHeaders":{"additionalProperties":{"type":"string"},"title":"Requiredheaders","type":"object"},"expiresAt":{"maximum":9007199254740991,"minimum":0,"title":"Expiresat","type":"integer"}},"required":["uploadId","uploadUrl","requiredHeaders","expiresAt"],"title":"ReserveUploadResult","type":"object"};

function validate220(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate220.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.uploadId === undefined) && (missing0 = "uploadId")) || ((data.uploadUrl === undefined) && (missing0 = "uploadUrl"))) || ((data.requiredHeaders === undefined) && (missing0 = "requiredHeaders"))) || ((data.expiresAt === undefined) && (missing0 = "expiresAt"))){
validate220.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "uploadId") || (key0 === "uploadUrl")) || (key0 === "requiredHeaders")) || (key0 === "expiresAt"))){
validate220.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.uploadId !== undefined){
let data0 = data.uploadId;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate220.errors = [{instancePath:instancePath+"/uploadId",schemaPath:"#/properties/uploadId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate220.errors = [{instancePath:instancePath+"/uploadId",schemaPath:"#/properties/uploadId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.uploadUrl !== undefined){
const _errs4 = errors;
if(typeof data.uploadUrl !== "string"){
validate220.errors = [{instancePath:instancePath+"/uploadUrl",schemaPath:"#/properties/uploadUrl/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requiredHeaders !== undefined){
let data2 = data.requiredHeaders;
const _errs6 = errors;
if(errors === _errs6){
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
for(const key1 in data2){
const _errs9 = errors;
if(typeof data2[key1] !== "string"){
validate220.errors = [{instancePath:instancePath+"/requiredHeaders/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/requiredHeaders/additionalProperties/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid1 = _errs9 === errors;
if(!valid1){
break;
}
}
}
else {
validate220.errors = [{instancePath:instancePath+"/requiredHeaders",schemaPath:"#/properties/requiredHeaders/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expiresAt !== undefined){
let data4 = data.expiresAt;
const _errs11 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate220.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs11){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate220.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 0 || isNaN(data4)){
validate220.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate220.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate220.errors = vErrors;
return errors === 0;
}
validate220.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpCompleteUpload = validate221;
const schema83 = {"additionalProperties":false,"properties":{"checksum":{"anyOf":[{"pattern":"^[a-f0-9]{64}$","type":"string"},{"type":"null"}],"default":null,"title":"Checksum"}},"title":"CompleteUpload","type":"object"};
const pattern5 = new RegExp("^[a-f0-9]{64}$", "u");

function validate221(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate221.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "checksum")){
validate221.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.checksum !== undefined){
let data0 = data.checksum;
const _errs3 = errors;
let valid1 = false;
const _errs4 = errors;
if(errors === _errs4){
if(typeof data0 === "string"){
if(!pattern5.test(data0)){
const err0 = {instancePath:instancePath+"/checksum",schemaPath:"#/properties/checksum/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
else {
const err1 = {instancePath:instancePath+"/checksum",schemaPath:"#/properties/checksum/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs4 === errors;
valid1 = valid1 || _valid0;
const _errs6 = errors;
if(data0 !== null){
const err2 = {instancePath:instancePath+"/checksum",schemaPath:"#/properties/checksum/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs6 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err3 = {instancePath:instancePath+"/checksum",schemaPath:"#/properties/checksum/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
validate221.errors = vErrors;
return false;
}
else {
errors = _errs3;
if(vErrors !== null){
if(_errs3){
vErrors.length = _errs3;
}
else {
vErrors = null;
}
}
}
}
}
}
else {
validate221.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate221.errors = vErrors;
return errors === 0;
}
validate221.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpCompleteUploadResult = validate222;
const schema84 = {"additionalProperties":false,"properties":{"trackId":{"format":"uuid","title":"Trackid","type":"string"},"status":{"const":"processing","default":"processing","title":"Status","type":"string"}},"required":["trackId"],"title":"CompleteUploadResult","type":"object"};

function validate222(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate222.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.trackId === undefined) && (missing0 = "trackId")){
validate222.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "trackId") || (key0 === "status"))){
validate222.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.trackId !== undefined){
let data0 = data.trackId;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate222.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate222.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
let data1 = data.status;
const _errs4 = errors;
if(typeof data1 !== "string"){
validate222.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("processing" !== data1){
validate222.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/const",keyword:"const",params:{allowedValue: "processing"},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate222.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate222.errors = vErrors;
return errors === 0;
}
validate222.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpTrack = validate223;
const schema85 = {"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"title":{"title":"Title","type":"string"},"artist":{"title":"Artist","type":"string"},"durationMs":{"anyOf":[{"maximum":900000,"minimum":0,"type":"integer"},{"type":"null"}],"title":"Durationms"},"status":{"enum":["uploading","processing","ready","failed"],"title":"Status","type":"string"},"errorCode":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Errorcode"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Mediaversion"},"coverUrl":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Coverurl"},"sourceUri":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Sourceuri"},"licenseId":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Licenseid"},"licenseUri":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Licenseuri"}},"required":["id","title","artist","durationMs","status"],"title":"Track","type":"object"};

function validate223(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate223.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.id === undefined) && (missing0 = "id")) || ((data.title === undefined) && (missing0 = "title"))) || ((data.artist === undefined) && (missing0 = "artist"))) || ((data.durationMs === undefined) && (missing0 = "durationMs"))) || ((data.status === undefined) && (missing0 = "status"))){
validate223.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema85.properties, key0))){
validate223.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate223.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate223.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.title !== undefined){
const _errs4 = errors;
if(typeof data.title !== "string"){
validate223.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.artist !== undefined){
const _errs6 = errors;
if(typeof data.artist !== "string"){
validate223.errors = [{instancePath:instancePath+"/artist",schemaPath:"#/properties/artist/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.durationMs !== undefined){
let data3 = data.durationMs;
const _errs8 = errors;
const _errs9 = errors;
let valid1 = false;
const _errs10 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
const err0 = {instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/anyOf/0/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(errors === _errs10){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 900000 || isNaN(data3)){
const err1 = {instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/anyOf/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
else {
if(data3 < 0 || isNaN(data3)){
const err2 = {instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/anyOf/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
}
}
var _valid0 = _errs10 === errors;
valid1 = valid1 || _valid0;
const _errs12 = errors;
if(data3 !== null){
const err3 = {instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
var _valid0 = _errs12 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err4 = {instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
validate223.errors = vErrors;
return false;
}
else {
errors = _errs9;
if(vErrors !== null){
if(_errs9){
vErrors.length = _errs9;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
let data4 = data.status;
const _errs14 = errors;
if(typeof data4 !== "string"){
validate223.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((((data4 === "uploading") || (data4 === "processing")) || (data4 === "ready")) || (data4 === "failed"))){
validate223.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema85.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.errorCode !== undefined){
let data5 = data.errorCode;
const _errs16 = errors;
const _errs17 = errors;
let valid2 = false;
const _errs18 = errors;
if(typeof data5 !== "string"){
const err5 = {instancePath:instancePath+"/errorCode",schemaPath:"#/properties/errorCode/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
var _valid1 = _errs18 === errors;
valid2 = valid2 || _valid1;
const _errs20 = errors;
if(data5 !== null){
const err6 = {instancePath:instancePath+"/errorCode",schemaPath:"#/properties/errorCode/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var _valid1 = _errs20 === errors;
valid2 = valid2 || _valid1;
if(!valid2){
const err7 = {instancePath:instancePath+"/errorCode",schemaPath:"#/properties/errorCode/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
validate223.errors = vErrors;
return false;
}
else {
errors = _errs17;
if(vErrors !== null){
if(_errs17){
vErrors.length = _errs17;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mediaVersion !== undefined){
let data6 = data.mediaVersion;
const _errs22 = errors;
const _errs23 = errors;
let valid3 = false;
const _errs24 = errors;
if(typeof data6 !== "string"){
const err8 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
var _valid2 = _errs24 === errors;
valid3 = valid3 || _valid2;
const _errs26 = errors;
if(data6 !== null){
const err9 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
var _valid2 = _errs26 === errors;
valid3 = valid3 || _valid2;
if(!valid3){
const err10 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
validate223.errors = vErrors;
return false;
}
else {
errors = _errs23;
if(vErrors !== null){
if(_errs23){
vErrors.length = _errs23;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs22 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.coverUrl !== undefined){
let data7 = data.coverUrl;
const _errs28 = errors;
const _errs29 = errors;
let valid4 = false;
const _errs30 = errors;
if(typeof data7 !== "string"){
const err11 = {instancePath:instancePath+"/coverUrl",schemaPath:"#/properties/coverUrl/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
var _valid3 = _errs30 === errors;
valid4 = valid4 || _valid3;
const _errs32 = errors;
if(data7 !== null){
const err12 = {instancePath:instancePath+"/coverUrl",schemaPath:"#/properties/coverUrl/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
var _valid3 = _errs32 === errors;
valid4 = valid4 || _valid3;
if(!valid4){
const err13 = {instancePath:instancePath+"/coverUrl",schemaPath:"#/properties/coverUrl/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
validate223.errors = vErrors;
return false;
}
else {
errors = _errs29;
if(vErrors !== null){
if(_errs29){
vErrors.length = _errs29;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs28 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sourceUri !== undefined){
let data8 = data.sourceUri;
const _errs34 = errors;
const _errs35 = errors;
let valid5 = false;
const _errs36 = errors;
if(typeof data8 !== "string"){
const err14 = {instancePath:instancePath+"/sourceUri",schemaPath:"#/properties/sourceUri/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
var _valid4 = _errs36 === errors;
valid5 = valid5 || _valid4;
const _errs38 = errors;
if(data8 !== null){
const err15 = {instancePath:instancePath+"/sourceUri",schemaPath:"#/properties/sourceUri/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
var _valid4 = _errs38 === errors;
valid5 = valid5 || _valid4;
if(!valid5){
const err16 = {instancePath:instancePath+"/sourceUri",schemaPath:"#/properties/sourceUri/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
validate223.errors = vErrors;
return false;
}
else {
errors = _errs35;
if(vErrors !== null){
if(_errs35){
vErrors.length = _errs35;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs34 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.licenseId !== undefined){
let data9 = data.licenseId;
const _errs40 = errors;
const _errs41 = errors;
let valid6 = false;
const _errs42 = errors;
if(typeof data9 !== "string"){
const err17 = {instancePath:instancePath+"/licenseId",schemaPath:"#/properties/licenseId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
var _valid5 = _errs42 === errors;
valid6 = valid6 || _valid5;
const _errs44 = errors;
if(data9 !== null){
const err18 = {instancePath:instancePath+"/licenseId",schemaPath:"#/properties/licenseId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
var _valid5 = _errs44 === errors;
valid6 = valid6 || _valid5;
if(!valid6){
const err19 = {instancePath:instancePath+"/licenseId",schemaPath:"#/properties/licenseId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
validate223.errors = vErrors;
return false;
}
else {
errors = _errs41;
if(vErrors !== null){
if(_errs41){
vErrors.length = _errs41;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs40 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.licenseUri !== undefined){
let data10 = data.licenseUri;
const _errs46 = errors;
const _errs47 = errors;
let valid7 = false;
const _errs48 = errors;
if(typeof data10 !== "string"){
const err20 = {instancePath:instancePath+"/licenseUri",schemaPath:"#/properties/licenseUri/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
var _valid6 = _errs48 === errors;
valid7 = valid7 || _valid6;
const _errs50 = errors;
if(data10 !== null){
const err21 = {instancePath:instancePath+"/licenseUri",schemaPath:"#/properties/licenseUri/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
var _valid6 = _errs50 === errors;
valid7 = valid7 || _valid6;
if(!valid7){
const err22 = {instancePath:instancePath+"/licenseUri",schemaPath:"#/properties/licenseUri/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
validate223.errors = vErrors;
return false;
}
else {
errors = _errs47;
if(vErrors !== null){
if(_errs47){
vErrors.length = _errs47;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs46 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate223.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate223.errors = vErrors;
return errors === 0;
}
validate223.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpTrackList = validate224;
const schema86 = {"additionalProperties":false,"properties":{"items":{"items":{"$ref":"#/$defs/Track"},"title":"Items","type":"array"},"nextCursor":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"default":null,"title":"Nextcursor"}},"required":["items"],"title":"TrackList","type":"object"};

function validate188(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate188.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.id === undefined) && (missing0 = "id")) || ((data.title === undefined) && (missing0 = "title"))) || ((data.artist === undefined) && (missing0 = "artist"))) || ((data.durationMs === undefined) && (missing0 = "durationMs"))) || ((data.status === undefined) && (missing0 = "status"))){
validate188.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema85.properties, key0))){
validate188.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.id !== undefined){
let data0 = data.id;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate188.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate188.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.title !== undefined){
const _errs4 = errors;
if(typeof data.title !== "string"){
validate188.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.artist !== undefined){
const _errs6 = errors;
if(typeof data.artist !== "string"){
validate188.errors = [{instancePath:instancePath+"/artist",schemaPath:"#/properties/artist/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.durationMs !== undefined){
let data3 = data.durationMs;
const _errs8 = errors;
const _errs9 = errors;
let valid1 = false;
const _errs10 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
const err0 = {instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/anyOf/0/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(errors === _errs10){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 900000 || isNaN(data3)){
const err1 = {instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/anyOf/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
else {
if(data3 < 0 || isNaN(data3)){
const err2 = {instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/anyOf/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
}
}
var _valid0 = _errs10 === errors;
valid1 = valid1 || _valid0;
const _errs12 = errors;
if(data3 !== null){
const err3 = {instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
var _valid0 = _errs12 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err4 = {instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
validate188.errors = vErrors;
return false;
}
else {
errors = _errs9;
if(vErrors !== null){
if(_errs9){
vErrors.length = _errs9;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
let data4 = data.status;
const _errs14 = errors;
if(typeof data4 !== "string"){
validate188.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((((data4 === "uploading") || (data4 === "processing")) || (data4 === "ready")) || (data4 === "failed"))){
validate188.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema85.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.errorCode !== undefined){
let data5 = data.errorCode;
const _errs16 = errors;
const _errs17 = errors;
let valid2 = false;
const _errs18 = errors;
if(typeof data5 !== "string"){
const err5 = {instancePath:instancePath+"/errorCode",schemaPath:"#/properties/errorCode/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
var _valid1 = _errs18 === errors;
valid2 = valid2 || _valid1;
const _errs20 = errors;
if(data5 !== null){
const err6 = {instancePath:instancePath+"/errorCode",schemaPath:"#/properties/errorCode/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var _valid1 = _errs20 === errors;
valid2 = valid2 || _valid1;
if(!valid2){
const err7 = {instancePath:instancePath+"/errorCode",schemaPath:"#/properties/errorCode/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
validate188.errors = vErrors;
return false;
}
else {
errors = _errs17;
if(vErrors !== null){
if(_errs17){
vErrors.length = _errs17;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mediaVersion !== undefined){
let data6 = data.mediaVersion;
const _errs22 = errors;
const _errs23 = errors;
let valid3 = false;
const _errs24 = errors;
if(typeof data6 !== "string"){
const err8 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
var _valid2 = _errs24 === errors;
valid3 = valid3 || _valid2;
const _errs26 = errors;
if(data6 !== null){
const err9 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
var _valid2 = _errs26 === errors;
valid3 = valid3 || _valid2;
if(!valid3){
const err10 = {instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
validate188.errors = vErrors;
return false;
}
else {
errors = _errs23;
if(vErrors !== null){
if(_errs23){
vErrors.length = _errs23;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs22 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.coverUrl !== undefined){
let data7 = data.coverUrl;
const _errs28 = errors;
const _errs29 = errors;
let valid4 = false;
const _errs30 = errors;
if(typeof data7 !== "string"){
const err11 = {instancePath:instancePath+"/coverUrl",schemaPath:"#/properties/coverUrl/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
var _valid3 = _errs30 === errors;
valid4 = valid4 || _valid3;
const _errs32 = errors;
if(data7 !== null){
const err12 = {instancePath:instancePath+"/coverUrl",schemaPath:"#/properties/coverUrl/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
var _valid3 = _errs32 === errors;
valid4 = valid4 || _valid3;
if(!valid4){
const err13 = {instancePath:instancePath+"/coverUrl",schemaPath:"#/properties/coverUrl/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
validate188.errors = vErrors;
return false;
}
else {
errors = _errs29;
if(vErrors !== null){
if(_errs29){
vErrors.length = _errs29;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs28 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sourceUri !== undefined){
let data8 = data.sourceUri;
const _errs34 = errors;
const _errs35 = errors;
let valid5 = false;
const _errs36 = errors;
if(typeof data8 !== "string"){
const err14 = {instancePath:instancePath+"/sourceUri",schemaPath:"#/properties/sourceUri/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
var _valid4 = _errs36 === errors;
valid5 = valid5 || _valid4;
const _errs38 = errors;
if(data8 !== null){
const err15 = {instancePath:instancePath+"/sourceUri",schemaPath:"#/properties/sourceUri/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
var _valid4 = _errs38 === errors;
valid5 = valid5 || _valid4;
if(!valid5){
const err16 = {instancePath:instancePath+"/sourceUri",schemaPath:"#/properties/sourceUri/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
validate188.errors = vErrors;
return false;
}
else {
errors = _errs35;
if(vErrors !== null){
if(_errs35){
vErrors.length = _errs35;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs34 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.licenseId !== undefined){
let data9 = data.licenseId;
const _errs40 = errors;
const _errs41 = errors;
let valid6 = false;
const _errs42 = errors;
if(typeof data9 !== "string"){
const err17 = {instancePath:instancePath+"/licenseId",schemaPath:"#/properties/licenseId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
var _valid5 = _errs42 === errors;
valid6 = valid6 || _valid5;
const _errs44 = errors;
if(data9 !== null){
const err18 = {instancePath:instancePath+"/licenseId",schemaPath:"#/properties/licenseId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
var _valid5 = _errs44 === errors;
valid6 = valid6 || _valid5;
if(!valid6){
const err19 = {instancePath:instancePath+"/licenseId",schemaPath:"#/properties/licenseId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
validate188.errors = vErrors;
return false;
}
else {
errors = _errs41;
if(vErrors !== null){
if(_errs41){
vErrors.length = _errs41;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs40 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.licenseUri !== undefined){
let data10 = data.licenseUri;
const _errs46 = errors;
const _errs47 = errors;
let valid7 = false;
const _errs48 = errors;
if(typeof data10 !== "string"){
const err20 = {instancePath:instancePath+"/licenseUri",schemaPath:"#/properties/licenseUri/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
var _valid6 = _errs48 === errors;
valid7 = valid7 || _valid6;
const _errs50 = errors;
if(data10 !== null){
const err21 = {instancePath:instancePath+"/licenseUri",schemaPath:"#/properties/licenseUri/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
var _valid6 = _errs50 === errors;
valid7 = valid7 || _valid6;
if(!valid7){
const err22 = {instancePath:instancePath+"/licenseUri",schemaPath:"#/properties/licenseUri/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
validate188.errors = vErrors;
return false;
}
else {
errors = _errs47;
if(vErrors !== null){
if(_errs47){
vErrors.length = _errs47;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs46 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate188.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate188.errors = vErrors;
return errors === 0;
}
validate188.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate224(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate224.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.items === undefined) && (missing0 = "items")){
validate224.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "items") || (key0 === "nextCursor"))){
validate224.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.items !== undefined){
let data0 = data.items;
const _errs2 = errors;
if(errors === _errs2){
if(Array.isArray(data0)){
var valid1 = true;
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
const _errs4 = errors;
if(!(validate188(data0[i0], {instancePath:instancePath+"/items/" + i0,parentData:data0,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate188.errors : vErrors.concat(validate188.errors);
errors = vErrors.length;
}
var valid1 = _errs4 === errors;
if(!valid1){
break;
}
}
}
else {
validate224.errors = [{instancePath:instancePath+"/items",schemaPath:"#/properties/items/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nextCursor !== undefined){
let data2 = data.nextCursor;
const _errs5 = errors;
const _errs6 = errors;
let valid2 = false;
const _errs7 = errors;
if(errors === _errs7){
if(errors === _errs7){
if(typeof data2 === "string"){
if(!(formats0.test(data2))){
const err0 = {instancePath:instancePath+"/nextCursor",schemaPath:"#/properties/nextCursor/anyOf/0/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
else {
const err1 = {instancePath:instancePath+"/nextCursor",schemaPath:"#/properties/nextCursor/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
var _valid0 = _errs7 === errors;
valid2 = valid2 || _valid0;
const _errs9 = errors;
if(data2 !== null){
const err2 = {instancePath:instancePath+"/nextCursor",schemaPath:"#/properties/nextCursor/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs9 === errors;
valid2 = valid2 || _valid0;
if(!valid2){
const err3 = {instancePath:instancePath+"/nextCursor",schemaPath:"#/properties/nextCursor/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
validate224.errors = vErrors;
return false;
}
else {
errors = _errs6;
if(vErrors !== null){
if(_errs6){
vErrors.length = _errs6;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate224.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate224.errors = vErrors;
return errors === 0;
}
validate224.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpPlaybackURL = validate226;
const schema87 = {"additionalProperties":false,"properties":{"url":{"title":"Url","type":"string"},"expiresAt":{"maximum":9007199254740991,"minimum":0,"title":"Expiresat","type":"integer"},"mediaVersion":{"title":"Mediaversion","type":"string"},"checksum":{"title":"Checksum","type":"string"},"contentType":{"title":"Contenttype","type":"string"}},"required":["url","expiresAt","mediaVersion","checksum","contentType"],"title":"PlaybackURL","type":"object"};

function validate226(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate226.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.url === undefined) && (missing0 = "url")) || ((data.expiresAt === undefined) && (missing0 = "expiresAt"))) || ((data.mediaVersion === undefined) && (missing0 = "mediaVersion"))) || ((data.checksum === undefined) && (missing0 = "checksum"))) || ((data.contentType === undefined) && (missing0 = "contentType"))){
validate226.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "url") || (key0 === "expiresAt")) || (key0 === "mediaVersion")) || (key0 === "checksum")) || (key0 === "contentType"))){
validate226.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.url !== undefined){
const _errs2 = errors;
if(typeof data.url !== "string"){
validate226.errors = [{instancePath:instancePath+"/url",schemaPath:"#/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.expiresAt !== undefined){
let data1 = data.expiresAt;
const _errs4 = errors;
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
validate226.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs4){
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 > 9007199254740991 || isNaN(data1)){
validate226.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data1 < 0 || isNaN(data1)){
validate226.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mediaVersion !== undefined){
const _errs6 = errors;
if(typeof data.mediaVersion !== "string"){
validate226.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.checksum !== undefined){
const _errs8 = errors;
if(typeof data.checksum !== "string"){
validate226.errors = [{instancePath:instancePath+"/checksum",schemaPath:"#/properties/checksum/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.contentType !== undefined){
const _errs10 = errors;
if(typeof data.contentType !== "string"){
validate226.errors = [{instancePath:instancePath+"/contentType",schemaPath:"#/properties/contentType/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
else {
validate226.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate226.errors = vErrors;
return errors === 0;
}
validate226.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpHTTPError = validate227;
const schema88 = {"additionalProperties":false,"properties":{"error":{"$ref":"#/$defs/ErrorBody"}},"required":["error"],"title":"HTTPError","type":"object"};
const schema89 = {"additionalProperties":false,"properties":{"code":{"title":"Code","type":"string"},"message":{"title":"Message","type":"string"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"details":{"anyOf":[{"items":{"$ref":"#/$defs/ValidationDetail"},"type":"array"},{"$ref":"#/$defs/ConflictDetail"},{"type":"null"}],"default":null,"title":"Details"}},"required":["code","message","requestId"],"title":"ErrorBody","type":"object"};
const schema90 = {"additionalProperties":false,"properties":{"field":{"title":"Field","type":"string"},"code":{"title":"Code","type":"string"}},"required":["field","code"],"title":"ValidationDetail","type":"object"};

function validate197(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate197.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.field === undefined) && (missing0 = "field")) || ((data.code === undefined) && (missing0 = "code"))){
validate197.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "field") || (key0 === "code"))){
validate197.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.field !== undefined){
const _errs2 = errors;
if(typeof data.field !== "string"){
validate197.errors = [{instancePath:instancePath+"/field",schemaPath:"#/properties/field/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.code !== undefined){
const _errs4 = errors;
if(typeof data.code !== "string"){
validate197.errors = [{instancePath:instancePath+"/code",schemaPath:"#/properties/code/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate197.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate197.errors = vErrors;
return errors === 0;
}
validate197.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema91 = {"additionalProperties":false,"properties":{"snapshot":{"$ref":"#/$defs/Snapshot"}},"required":["snapshot"],"title":"ConflictDetail","type":"object"};

function validate199(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate199.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.snapshot === undefined) && (missing0 = "snapshot")){
validate199.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "snapshot")){
validate199.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.snapshot !== undefined){
if(!(validate153(data.snapshot, {instancePath:instancePath+"/snapshot",parentData:data,parentDataProperty:"snapshot",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate153.errors : vErrors.concat(validate153.errors);
errors = vErrors.length;
}
}
}
}
}
else {
validate199.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate199.errors = vErrors;
return errors === 0;
}
validate199.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate196(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate196.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.code === undefined) && (missing0 = "code")) || ((data.message === undefined) && (missing0 = "message"))) || ((data.requestId === undefined) && (missing0 = "requestId"))){
validate196.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "code") || (key0 === "message")) || (key0 === "requestId")) || (key0 === "details"))){
validate196.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.code !== undefined){
const _errs2 = errors;
if(typeof data.code !== "string"){
validate196.errors = [{instancePath:instancePath+"/code",schemaPath:"#/properties/code/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.message !== undefined){
const _errs4 = errors;
if(typeof data.message !== "string"){
validate196.errors = [{instancePath:instancePath+"/message",schemaPath:"#/properties/message/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestId !== undefined){
let data2 = data.requestId;
const _errs6 = errors;
if(errors === _errs6){
if(errors === _errs6){
if(typeof data2 === "string"){
if(!(formats0.test(data2))){
validate196.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate196.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.details !== undefined){
let data3 = data.details;
const _errs8 = errors;
const _errs9 = errors;
let valid1 = false;
const _errs10 = errors;
if(errors === _errs10){
if(Array.isArray(data3)){
var valid2 = true;
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
const _errs12 = errors;
if(!(validate197(data3[i0], {instancePath:instancePath+"/details/" + i0,parentData:data3,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate197.errors : vErrors.concat(validate197.errors);
errors = vErrors.length;
}
var valid2 = _errs12 === errors;
if(!valid2){
break;
}
}
}
else {
const err0 = {instancePath:instancePath+"/details",schemaPath:"#/properties/details/anyOf/0/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
var _valid0 = _errs10 === errors;
valid1 = valid1 || _valid0;
const _errs13 = errors;
if(!(validate199(data3, {instancePath:instancePath+"/details",parentData:data,parentDataProperty:"details",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate199.errors : vErrors.concat(validate199.errors);
errors = vErrors.length;
}
var _valid0 = _errs13 === errors;
valid1 = valid1 || _valid0;
const _errs14 = errors;
if(data3 !== null){
const err1 = {instancePath:instancePath+"/details",schemaPath:"#/properties/details/anyOf/2/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
var _valid0 = _errs14 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err2 = {instancePath:instancePath+"/details",schemaPath:"#/properties/details/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate196.errors = vErrors;
return false;
}
else {
errors = _errs9;
if(vErrors !== null){
if(_errs9){
vErrors.length = _errs9;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate196.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate196.errors = vErrors;
return errors === 0;
}
validate196.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate227(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate227.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.error === undefined) && (missing0 = "error")){
validate227.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "error")){
validate227.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.error !== undefined){
if(!(validate196(data.error, {instancePath:instancePath+"/error",parentData:data,parentDataProperty:"error",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate196.errors : vErrors.concat(validate196.errors);
errors = vErrors.length;
}
}
}
}
}
else {
validate227.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate227.errors = vErrors;
return errors === 0;
}
validate227.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};
