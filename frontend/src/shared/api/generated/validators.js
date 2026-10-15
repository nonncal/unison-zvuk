import runtime0 from 'ajv/dist/runtime/ucs2length.js'
"use strict";
export const validateCommand = validate52;
const schema19 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$defs":{"ClockProbe":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"default":null,"title":"Expectedplaybackrevision","type":"null"},"type":{"const":"clock.probe","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ProbePayload"}},"required":["v","requestId","type","payload"],"title":"ClockProbe","type":"object"},"EmptyPayload":{"additionalProperties":false,"properties":{},"title":"EmptyPayload","type":"object"},"HeartbeatPong":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"default":null,"title":"Expectedplaybackrevision","type":"null"},"type":{"const":"heartbeat.pong","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/PingPayload"}},"required":["v","requestId","type","payload"],"title":"HeartbeatPong","type":"object"},"ParticipantReadiness":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"default":null,"title":"Expectedplaybackrevision","type":"null"},"type":{"const":"participant.readiness","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/Readiness"}},"required":["v","requestId","type","payload"],"title":"ParticipantReadiness","type":"object"},"Pause":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Expectedplaybackrevision","type":"integer"},"type":{"const":"playback.pause","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/EmptyPayload"}},"required":["v","requestId","expectedPlaybackRevision","type","payload"],"title":"Pause","type":"object"},"PingPayload":{"additionalProperties":false,"properties":{"pingId":{"format":"uuid","title":"Pingid","type":"string"}},"required":["pingId"],"title":"PingPayload","type":"object"},"Play":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Expectedplaybackrevision","type":"integer"},"type":{"const":"playback.play","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/PlayPayload"}},"required":["v","requestId","expectedPlaybackRevision","type","payload"],"title":"Play","type":"object"},"PlayPayload":{"additionalProperties":false,"properties":{"allowNotReady":{"default":false,"title":"Allownotready","type":"boolean"}},"title":"PlayPayload","type":"object"},"ProbePayload":{"additionalProperties":false,"properties":{"clientSentAtMs":{"maximum":9007199254740991,"minimum":0,"title":"Clientsentatms","type":"integer"},"probeId":{"format":"uuid","title":"Probeid","type":"string"}},"required":["clientSentAtMs","probeId"],"title":"ProbePayload","type":"object"},"ReactionPayload":{"additionalProperties":false,"properties":{"emoji":{"enum":["❤️","🔥","👏","✨","🎶","😂"],"title":"Emoji","type":"string"}},"required":["emoji"],"title":"ReactionPayload","type":"object"},"Readiness":{"additionalProperties":false,"properties":{"trackId":{"format":"uuid","title":"Trackid","type":"string"},"mediaVersion":{"maxLength":128,"minLength":1,"title":"Mediaversion","type":"string"},"state":{"enum":["loading","ready","buffering","autoplayBlocked","error"],"title":"State","type":"string"},"bufferedAheadMs":{"maximum":900000,"minimum":0,"title":"Bufferedaheadms","type":"integer"},"autoplayAllowed":{"title":"Autoplayallowed","type":"boolean"}},"required":["trackId","mediaVersion","state","bufferedAheadMs","autoplayAllowed"],"title":"Readiness","type":"object"},"Seek":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Expectedplaybackrevision","type":"integer"},"type":{"const":"playback.seek","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/SeekPayload"}},"required":["v","requestId","expectedPlaybackRevision","type","payload"],"title":"Seek","type":"object"},"SeekPayload":{"additionalProperties":false,"properties":{"positionMs":{"maximum":900000,"minimum":0,"title":"Positionms","type":"integer"}},"required":["positionMs"],"title":"SeekPayload","type":"object"},"SelectPayload":{"additionalProperties":false,"properties":{"trackId":{"format":"uuid","title":"Trackid","type":"string"}},"required":["trackId"],"title":"SelectPayload","type":"object"},"SelectTrack":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Expectedplaybackrevision","type":"integer"},"type":{"const":"playback.select","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/SelectPayload"}},"required":["v","requestId","expectedPlaybackRevision","type","payload"],"title":"SelectTrack","type":"object"},"SendReaction":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"default":null,"title":"Expectedplaybackrevision","type":"null"},"type":{"const":"reaction.send","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ReactionPayload"}},"required":["v","requestId","type","payload"],"title":"SendReaction","type":"object"},"SnapshotRequest":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"default":null,"title":"Expectedplaybackrevision","type":"null"},"type":{"const":"room.snapshot.request","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/EmptyPayload"}},"required":["v","requestId","type","payload"],"title":"SnapshotRequest","type":"object"},"Telemetry":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"default":null,"title":"Expectedplaybackrevision","type":"null"},"type":{"const":"sync.telemetry","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/TelemetryPayload"}},"required":["v","requestId","type","payload"],"title":"Telemetry","type":"object"},"TelemetryPayload":{"additionalProperties":false,"properties":{"trackId":{"format":"uuid","title":"Trackid","type":"string"},"mediaVersion":{"maxLength":128,"minLength":1,"title":"Mediaversion","type":"string"},"driftMs":{"maximum":900000,"minimum":-900000,"title":"Driftms","type":"integer"},"rttMs":{"maximum":60000,"minimum":0,"title":"Rttms","type":"integer"},"localState":{"enum":["playing","paused","buffering","autoplayBlocked","error"],"title":"Localstate","type":"string"}},"required":["trackId","mediaVersion","driftMs","rttMs","localState"],"title":"TelemetryPayload","type":"object"}},"oneOf":[{"$ref":"#/$defs/ClockProbe"},{"$ref":"#/$defs/HeartbeatPong"},{"$ref":"#/$defs/SnapshotRequest"},{"$ref":"#/$defs/ParticipantReadiness"},{"$ref":"#/$defs/SelectTrack"},{"$ref":"#/$defs/Play"},{"$ref":"#/$defs/Pause"},{"$ref":"#/$defs/Seek"},{"$ref":"#/$defs/Telemetry"},{"$ref":"#/$defs/SendReaction"}],"$id":"urn:unison:client-command-v1","title":"ClientCommand"};
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

const schema37 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"expectedPlaybackRevision":{"default":null,"title":"Expectedplaybackrevision","type":"null"},"type":{"const":"reaction.send","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ReactionPayload"}},"required":["v","requestId","type","payload"],"title":"SendReaction","type":"object"};
const schema38 = {"additionalProperties":false,"properties":{"emoji":{"enum":["❤️","🔥","👏","✨","🎶","😂"],"title":"Emoji","type":"string"}},"required":["emoji"],"title":"ReactionPayload","type":"object"};

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
if((data.emoji === undefined) && (missing0 = "emoji")){
validate89.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "emoji")){
validate89.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.emoji !== undefined){
let data0 = data.emoji;
if(typeof data0 !== "string"){
validate89.errors = [{instancePath:instancePath+"/emoji",schemaPath:"#/properties/emoji/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((((((data0 === "❤️") || (data0 === "🔥")) || (data0 === "👏")) || (data0 === "✨")) || (data0 === "🎶")) || (data0 === "😂"))){
validate89.errors = [{instancePath:instancePath+"/emoji",schemaPath:"#/properties/emoji/enum",keyword:"enum",params:{allowedValues: schema38.properties.emoji.enum},message:"must be equal to one of the allowed values"}];
return false;
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


function validate88(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate88.evaluated;
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
validate88.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "v") || (key0 === "requestId")) || (key0 === "expectedPlaybackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate88.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate88.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate88.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
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
validate88.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate88.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate88.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/type",keyword:"type",params:{type: "null"},message:"must be null"}];
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
validate88.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("reaction.send" !== data3){
validate88.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "reaction.send"},message:"must be equal to constant"}];
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
if(!(validate89(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate89.errors : vErrors.concat(validate89.errors);
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
validate88.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate88.errors = vErrors;
return errors === 0;
}
validate88.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


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
const _errs10 = errors;
if(!(validate88(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate88.errors : vErrors.concat(validate88.errors);
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

export const validateEvent = validate92;
const schema39 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$defs":{"AckPayload":{"additionalProperties":false,"properties":{"requestId":{"format":"uuid","title":"Requestid","type":"string"},"acceptedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Acceptedplaybackrevision","type":"integer"},"effectiveAtServerTimeMs":{"anyOf":[{"maximum":9007199254740991,"minimum":0,"type":"integer"},{"type":"null"}],"default":null,"title":"Effectiveatservertimems"}},"required":["requestId","acceptedPlaybackRevision"],"title":"AckPayload","type":"object"},"ClockReply":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"clock.reply","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ClockReplyPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"ClockReply","type":"object"},"ClockReplyPayload":{"additionalProperties":false,"properties":{"clientSentAtMs":{"maximum":9007199254740991,"minimum":0,"title":"Clientsentatms","type":"integer"},"probeId":{"format":"uuid","title":"Probeid","type":"string"},"serverReceivedAtMs":{"maximum":9007199254740991,"minimum":0,"title":"Serverreceivedatms","type":"integer"},"serverSentAtMs":{"maximum":9007199254740991,"minimum":0,"title":"Serversentatms","type":"integer"}},"required":["clientSentAtMs","probeId","serverReceivedAtMs","serverSentAtMs"],"title":"ClockReplyPayload","type":"object"},"ClosedPayload":{"additionalProperties":false,"properties":{"reason":{"enum":["closedByHost","expired","emptyTimeout"],"title":"Reason","type":"string"}},"required":["reason"],"title":"ClosedPayload","type":"object"},"CommandAck":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"command.ack","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/AckPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"CommandAck","type":"object"},"CommandError":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"command.error","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ErrorPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"CommandError","type":"object"},"ErrorPayload":{"additionalProperties":false,"properties":{"requestId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Requestid"},"code":{"title":"Code","type":"string"},"message":{"title":"Message","type":"string"},"snapshot":{"anyOf":[{"$ref":"#/$defs/Snapshot"},{"type":"null"}],"default":null}},"required":["requestId","code","message"],"title":"ErrorPayload","type":"object"},"HeartbeatPing":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"heartbeat.ping","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/PingPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"HeartbeatPing","type":"object"},"Hello":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"hello","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/HelloPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"Hello","type":"object"},"HelloPayload":{"additionalProperties":false,"properties":{"connectionId":{"format":"uuid","title":"Connectionid","type":"string"},"epoch":{"format":"uuid","title":"Epoch","type":"string"},"protocolVersion":{"const":1,"default":1,"title":"Protocolversion","type":"integer"},"snapshot":{"$ref":"#/$defs/Snapshot"}},"required":["connectionId","epoch","snapshot"],"title":"HelloPayload","type":"object"},"HostChanged":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"host.changed","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/HostPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"HostChanged","type":"object"},"HostPayload":{"additionalProperties":false,"properties":{"participantId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Participantid"}},"required":["participantId"],"title":"HostPayload","type":"object"},"Participant":{"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"displayName":{"title":"Displayname","type":"string"},"role":{"enum":["host","listener"],"title":"Role","type":"string"},"connectionState":{"enum":["online","offline","connecting"],"title":"Connectionstate","type":"string"},"readiness":{"anyOf":[{"$ref":"#/$defs/Readiness"},{"type":"null"}]},"canEdit":{"default":false,"title":"Canedit","type":"boolean"}},"required":["id","displayName","role","connectionState","readiness"],"title":"Participant","type":"object"},"PendingTransition":{"additionalProperties":false,"properties":{"type":{"enum":["play","pause","seek"],"title":"Type","type":"string"},"nextStatus":{"enum":["paused","playing","ended"],"title":"Nextstatus","type":"string"},"positionMs":{"maximum":900000,"minimum":0,"title":"Positionms","type":"integer"},"effectiveAtServerTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Effectiveatservertimems","type":"integer"},"trackId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"default":null,"title":"Trackid"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Mediaversion"}},"required":["type","nextStatus","positionMs","effectiveAtServerTimeMs"],"title":"PendingTransition","type":"object"},"PingPayload":{"additionalProperties":false,"properties":{"pingId":{"format":"uuid","title":"Pingid","type":"string"}},"required":["pingId"],"title":"PingPayload","type":"object"},"Playback":{"additionalProperties":false,"properties":{"roomId":{"format":"uuid","title":"Roomid","type":"string"},"epoch":{"format":"uuid","title":"Epoch","type":"string"},"trackId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Trackid"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Mediaversion"},"status":{"enum":["empty","paused","playing","ended"],"title":"Status","type":"string"},"positionMs":{"maximum":900000,"minimum":0,"title":"Positionms","type":"integer"},"anchorServerTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Anchorservertimems","type":"integer"},"durationMs":{"maximum":900000,"minimum":0,"title":"Durationms","type":"integer"},"pendingTransition":{"anyOf":[{"$ref":"#/$defs/PendingTransition"},{"type":"null"}]}},"required":["roomId","epoch","trackId","mediaVersion","status","positionMs","anchorServerTimeMs","durationMs","pendingTransition"],"title":"Playback","type":"object"},"PlaybackState":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"playback.state","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/Playback"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"PlaybackState","type":"object"},"Playlist":{"additionalProperties":false,"properties":{"trackIds":{"items":{"format":"uuid","type":"string"},"maxItems":100,"title":"Trackids","type":"array"},"skippedTrackIds":{"items":{"format":"uuid","type":"string"},"maxItems":100,"title":"Skippedtrackids","type":"array"},"repeat":{"default":"off","enum":["off","all","one"],"title":"Repeat","type":"string"},"shuffle":{"default":false,"title":"Shuffle","type":"boolean"}},"title":"Playlist","type":"object"},"PresenceChanged":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"presence.changed","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/PresencePayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"PresenceChanged","type":"object"},"PresencePayload":{"additionalProperties":false,"properties":{"presenceSeq":{"maximum":9007199254740991,"minimum":0,"title":"Presenceseq","type":"integer"},"participants":{"items":{"$ref":"#/$defs/Participant"},"title":"Participants","type":"array"}},"required":["presenceSeq","participants"],"title":"PresencePayload","type":"object"},"ReactionCreated":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"reaction.created","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ReactionCreatedPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"ReactionCreated","type":"object"},"ReactionCreatedPayload":{"additionalProperties":false,"properties":{"emoji":{"enum":["❤️","🔥","👏","✨","🎶","😂"],"title":"Emoji","type":"string"},"participantId":{"format":"uuid","title":"Participantid","type":"string"}},"required":["emoji","participantId"],"title":"ReactionCreatedPayload","type":"object"},"Readiness":{"additionalProperties":false,"properties":{"trackId":{"format":"uuid","title":"Trackid","type":"string"},"mediaVersion":{"maxLength":128,"minLength":1,"title":"Mediaversion","type":"string"},"state":{"enum":["loading","ready","buffering","autoplayBlocked","error"],"title":"State","type":"string"},"bufferedAheadMs":{"maximum":900000,"minimum":0,"title":"Bufferedaheadms","type":"integer"},"autoplayAllowed":{"title":"Autoplayallowed","type":"boolean"}},"required":["trackId","mediaVersion","state","bufferedAheadMs","autoplayAllowed"],"title":"Readiness","type":"object"},"Room":{"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"title":{"title":"Title","type":"string"},"status":{"enum":["active","closed","expired"],"title":"Status","type":"string"},"capacity":{"maximum":10,"minimum":2,"title":"Capacity","type":"integer"},"expiresAt":{"maximum":9007199254740991,"minimum":0,"title":"Expiresat","type":"integer"},"hostParticipantId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Hostparticipantid"},"moderated":{"default":false,"title":"Moderated","type":"boolean"}},"required":["id","title","status","capacity","expiresAt","hostParticipantId"],"title":"Room","type":"object"},"RoomClosed":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"room.closed","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ClosedPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"RoomClosed","type":"object"},"RoomSnapshot":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"room.snapshot","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/Snapshot"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"RoomSnapshot","type":"object"},"Snapshot":{"additionalProperties":false,"properties":{"room":{"$ref":"#/$defs/Room"},"participants":{"items":{"$ref":"#/$defs/Participant"},"title":"Participants","type":"array"},"playback":{"$ref":"#/$defs/Playback"},"presenceSeq":{"maximum":9007199254740991,"minimum":0,"title":"Presenceseq","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"playlist":{"$ref":"#/$defs/Playlist"}},"required":["room","participants","playback","presenceSeq","playbackRevision"],"title":"Snapshot","type":"object"},"Track":{"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"title":{"title":"Title","type":"string"},"artist":{"title":"Artist","type":"string"},"durationMs":{"anyOf":[{"maximum":900000,"minimum":0,"type":"integer"},{"type":"null"}],"title":"Durationms"},"status":{"enum":["uploading","processing","ready","failed"],"title":"Status","type":"string"},"errorCode":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Errorcode"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Mediaversion"},"coverUrl":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Coverurl"},"sourceUri":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Sourceuri"},"licenseId":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Licenseid"},"licenseUri":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Licenseuri"}},"required":["id","title","artist","durationMs","status"],"title":"Track","type":"object"},"TrackPayload":{"additionalProperties":false,"properties":{"track":{"$ref":"#/$defs/Track"}},"required":["track"],"title":"TrackPayload","type":"object"},"TrackUpdated":{"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"track.updated","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/TrackPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"TrackUpdated","type":"object"}},"oneOf":[{"$ref":"#/$defs/Hello"},{"$ref":"#/$defs/RoomSnapshot"},{"$ref":"#/$defs/PlaybackState"},{"$ref":"#/$defs/ClockReply"},{"$ref":"#/$defs/HeartbeatPing"},{"$ref":"#/$defs/PresenceChanged"},{"$ref":"#/$defs/HostChanged"},{"$ref":"#/$defs/TrackUpdated"},{"$ref":"#/$defs/RoomClosed"},{"$ref":"#/$defs/CommandAck"},{"$ref":"#/$defs/CommandError"},{"$ref":"#/$defs/ReactionCreated"}],"$id":"urn:unison:server-event-v1","title":"ServerEvent"};
const schema40 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"hello","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/HelloPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"Hello","type":"object"};
const schema41 = {"additionalProperties":false,"properties":{"connectionId":{"format":"uuid","title":"Connectionid","type":"string"},"epoch":{"format":"uuid","title":"Epoch","type":"string"},"protocolVersion":{"const":1,"default":1,"title":"Protocolversion","type":"integer"},"snapshot":{"$ref":"#/$defs/Snapshot"}},"required":["connectionId","epoch","snapshot"],"title":"HelloPayload","type":"object"};
const schema42 = {"additionalProperties":false,"properties":{"room":{"$ref":"#/$defs/Room"},"participants":{"items":{"$ref":"#/$defs/Participant"},"title":"Participants","type":"array"},"playback":{"$ref":"#/$defs/Playback"},"presenceSeq":{"maximum":9007199254740991,"minimum":0,"title":"Presenceseq","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"playlist":{"$ref":"#/$defs/Playlist"}},"required":["room","participants","playback","presenceSeq","playbackRevision"],"title":"Snapshot","type":"object"};
const schema43 = {"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"title":{"title":"Title","type":"string"},"status":{"enum":["active","closed","expired"],"title":"Status","type":"string"},"capacity":{"maximum":10,"minimum":2,"title":"Capacity","type":"integer"},"expiresAt":{"maximum":9007199254740991,"minimum":0,"title":"Expiresat","type":"integer"},"hostParticipantId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Hostparticipantid"},"moderated":{"default":false,"title":"Moderated","type":"boolean"}},"required":["id","title","status","capacity","expiresAt","hostParticipantId"],"title":"Room","type":"object"};

function validate96(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate96.evaluated;
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
validate96.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((((key0 === "id") || (key0 === "title")) || (key0 === "status")) || (key0 === "capacity")) || (key0 === "expiresAt")) || (key0 === "hostParticipantId")) || (key0 === "moderated"))){
validate96.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate96.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate96.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate96.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate96.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data2 === "active") || (data2 === "closed")) || (data2 === "expired"))){
validate96.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema43.properties.status.enum},message:"must be equal to one of the allowed values"}];
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
validate96.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 10 || isNaN(data3)){
validate96.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10},message:"must be <= 10"}];
return false;
}
else {
if(data3 < 2 || isNaN(data3)){
validate96.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 2},message:"must be >= 2"}];
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
validate96.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs10){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate96.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 0 || isNaN(data4)){
validate96.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate96.errors = vErrors;
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
if(data.moderated !== undefined){
const _errs18 = errors;
if(typeof data.moderated !== "boolean"){
validate96.errors = [{instancePath:instancePath+"/moderated",schemaPath:"#/properties/moderated/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs18 === errors;
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
else {
validate96.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate96.errors = vErrors;
return errors === 0;
}
validate96.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema44 = {"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"displayName":{"title":"Displayname","type":"string"},"role":{"enum":["host","listener"],"title":"Role","type":"string"},"connectionState":{"enum":["online","offline","connecting"],"title":"Connectionstate","type":"string"},"readiness":{"anyOf":[{"$ref":"#/$defs/Readiness"},{"type":"null"}]},"canEdit":{"default":false,"title":"Canedit","type":"boolean"}},"required":["id","displayName","role","connectionState","readiness"],"title":"Participant","type":"object"};
const schema45 = {"additionalProperties":false,"properties":{"trackId":{"format":"uuid","title":"Trackid","type":"string"},"mediaVersion":{"maxLength":128,"minLength":1,"title":"Mediaversion","type":"string"},"state":{"enum":["loading","ready","buffering","autoplayBlocked","error"],"title":"State","type":"string"},"bufferedAheadMs":{"maximum":900000,"minimum":0,"title":"Bufferedaheadms","type":"integer"},"autoplayAllowed":{"title":"Autoplayallowed","type":"boolean"}},"required":["trackId","mediaVersion","state","bufferedAheadMs","autoplayAllowed"],"title":"Readiness","type":"object"};

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
if((((((data.trackId === undefined) && (missing0 = "trackId")) || ((data.mediaVersion === undefined) && (missing0 = "mediaVersion"))) || ((data.state === undefined) && (missing0 = "state"))) || ((data.bufferedAheadMs === undefined) && (missing0 = "bufferedAheadMs"))) || ((data.autoplayAllowed === undefined) && (missing0 = "autoplayAllowed"))){
validate99.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "trackId") || (key0 === "mediaVersion")) || (key0 === "state")) || (key0 === "bufferedAheadMs")) || (key0 === "autoplayAllowed"))){
validate99.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate99.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate99.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate99.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/maxLength",keyword:"maxLength",params:{limit: 128},message:"must NOT have more than 128 characters"}];
return false;
}
else {
if(func1(data1) < 1){
validate99.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate99.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate99.errors = [{instancePath:instancePath+"/state",schemaPath:"#/properties/state/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((((data2 === "loading") || (data2 === "ready")) || (data2 === "buffering")) || (data2 === "autoplayBlocked")) || (data2 === "error"))){
validate99.errors = [{instancePath:instancePath+"/state",schemaPath:"#/properties/state/enum",keyword:"enum",params:{allowedValues: schema45.properties.state.enum},message:"must be equal to one of the allowed values"}];
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
validate99.errors = [{instancePath:instancePath+"/bufferedAheadMs",schemaPath:"#/properties/bufferedAheadMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 900000 || isNaN(data3)){
validate99.errors = [{instancePath:instancePath+"/bufferedAheadMs",schemaPath:"#/properties/bufferedAheadMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate99.errors = [{instancePath:instancePath+"/bufferedAheadMs",schemaPath:"#/properties/bufferedAheadMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate99.errors = [{instancePath:instancePath+"/autoplayAllowed",schemaPath:"#/properties/autoplayAllowed/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
if((((((data.id === undefined) && (missing0 = "id")) || ((data.displayName === undefined) && (missing0 = "displayName"))) || ((data.role === undefined) && (missing0 = "role"))) || ((data.connectionState === undefined) && (missing0 = "connectionState"))) || ((data.readiness === undefined) && (missing0 = "readiness"))){
validate98.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "id") || (key0 === "displayName")) || (key0 === "role")) || (key0 === "connectionState")) || (key0 === "readiness")) || (key0 === "canEdit"))){
validate98.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate98.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate98.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate98.errors = [{instancePath:instancePath+"/displayName",schemaPath:"#/properties/displayName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate98.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((data2 === "host") || (data2 === "listener"))){
validate98.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/enum",keyword:"enum",params:{allowedValues: schema44.properties.role.enum},message:"must be equal to one of the allowed values"}];
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
validate98.errors = [{instancePath:instancePath+"/connectionState",schemaPath:"#/properties/connectionState/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data3 === "online") || (data3 === "offline")) || (data3 === "connecting"))){
validate98.errors = [{instancePath:instancePath+"/connectionState",schemaPath:"#/properties/connectionState/enum",keyword:"enum",params:{allowedValues: schema44.properties.connectionState.enum},message:"must be equal to one of the allowed values"}];
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
if(!(validate99(data4, {instancePath:instancePath+"/readiness",parentData:data,parentDataProperty:"readiness",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate99.errors : vErrors.concat(validate99.errors);
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
validate98.errors = vErrors;
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
if(data.canEdit !== undefined){
const _errs15 = errors;
if(typeof data.canEdit !== "boolean"){
validate98.errors = [{instancePath:instancePath+"/canEdit",schemaPath:"#/properties/canEdit/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs15 === errors;
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
validate98.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate98.errors = vErrors;
return errors === 0;
}
validate98.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema46 = {"additionalProperties":false,"properties":{"roomId":{"format":"uuid","title":"Roomid","type":"string"},"epoch":{"format":"uuid","title":"Epoch","type":"string"},"trackId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Trackid"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Mediaversion"},"status":{"enum":["empty","paused","playing","ended"],"title":"Status","type":"string"},"positionMs":{"maximum":900000,"minimum":0,"title":"Positionms","type":"integer"},"anchorServerTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Anchorservertimems","type":"integer"},"durationMs":{"maximum":900000,"minimum":0,"title":"Durationms","type":"integer"},"pendingTransition":{"anyOf":[{"$ref":"#/$defs/PendingTransition"},{"type":"null"}]}},"required":["roomId","epoch","trackId","mediaVersion","status","positionMs","anchorServerTimeMs","durationMs","pendingTransition"],"title":"Playback","type":"object"};
const func7 = Object.prototype.hasOwnProperty;
const schema47 = {"additionalProperties":false,"properties":{"type":{"enum":["play","pause","seek"],"title":"Type","type":"string"},"nextStatus":{"enum":["paused","playing","ended"],"title":"Nextstatus","type":"string"},"positionMs":{"maximum":900000,"minimum":0,"title":"Positionms","type":"integer"},"effectiveAtServerTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Effectiveatservertimems","type":"integer"},"trackId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"default":null,"title":"Trackid"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Mediaversion"}},"required":["type","nextStatus","positionMs","effectiveAtServerTimeMs"],"title":"PendingTransition","type":"object"};

function validate103(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate103.evaluated;
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
validate103.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "nextStatus")) || (key0 === "positionMs")) || (key0 === "effectiveAtServerTimeMs")) || (key0 === "trackId")) || (key0 === "mediaVersion"))){
validate103.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
const _errs2 = errors;
if(typeof data0 !== "string"){
validate103.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data0 === "play") || (data0 === "pause")) || (data0 === "seek"))){
validate103.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/enum",keyword:"enum",params:{allowedValues: schema47.properties.type.enum},message:"must be equal to one of the allowed values"}];
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
validate103.errors = [{instancePath:instancePath+"/nextStatus",schemaPath:"#/properties/nextStatus/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data1 === "paused") || (data1 === "playing")) || (data1 === "ended"))){
validate103.errors = [{instancePath:instancePath+"/nextStatus",schemaPath:"#/properties/nextStatus/enum",keyword:"enum",params:{allowedValues: schema47.properties.nextStatus.enum},message:"must be equal to one of the allowed values"}];
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
validate103.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 900000 || isNaN(data2)){
validate103.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate103.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate103.errors = [{instancePath:instancePath+"/effectiveAtServerTimeMs",schemaPath:"#/properties/effectiveAtServerTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate103.errors = [{instancePath:instancePath+"/effectiveAtServerTimeMs",schemaPath:"#/properties/effectiveAtServerTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate103.errors = [{instancePath:instancePath+"/effectiveAtServerTimeMs",schemaPath:"#/properties/effectiveAtServerTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate103.errors = vErrors;
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
validate103.errors = vErrors;
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
validate103.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate103.errors = vErrors;
return errors === 0;
}
validate103.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate102(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate102.evaluated;
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
validate102.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema46.properties, key0))){
validate102.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate102.errors = [{instancePath:instancePath+"/roomId",schemaPath:"#/properties/roomId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate102.errors = [{instancePath:instancePath+"/roomId",schemaPath:"#/properties/roomId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate102.errors = [{instancePath:instancePath+"/epoch",schemaPath:"#/properties/epoch/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate102.errors = [{instancePath:instancePath+"/epoch",schemaPath:"#/properties/epoch/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate102.errors = vErrors;
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
validate102.errors = vErrors;
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
validate102.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((((data4 === "empty") || (data4 === "paused")) || (data4 === "playing")) || (data4 === "ended"))){
validate102.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema46.properties.status.enum},message:"must be equal to one of the allowed values"}];
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
validate102.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs20){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 900000 || isNaN(data5)){
validate102.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate102.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate102.errors = [{instancePath:instancePath+"/anchorServerTimeMs",schemaPath:"#/properties/anchorServerTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs22){
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 > 9007199254740991 || isNaN(data6)){
validate102.errors = [{instancePath:instancePath+"/anchorServerTimeMs",schemaPath:"#/properties/anchorServerTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data6 < 0 || isNaN(data6)){
validate102.errors = [{instancePath:instancePath+"/anchorServerTimeMs",schemaPath:"#/properties/anchorServerTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate102.errors = [{instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs24){
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 > 900000 || isNaN(data7)){
validate102.errors = [{instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data7 < 0 || isNaN(data7)){
validate102.errors = [{instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
if(!(validate103(data8, {instancePath:instancePath+"/pendingTransition",parentData:data,parentDataProperty:"pendingTransition",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate103.errors : vErrors.concat(validate103.errors);
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
validate102.errors = vErrors;
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
validate102.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate102.errors = vErrors;
return errors === 0;
}
validate102.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema48 = {"additionalProperties":false,"properties":{"trackIds":{"items":{"format":"uuid","type":"string"},"maxItems":100,"title":"Trackids","type":"array"},"skippedTrackIds":{"items":{"format":"uuid","type":"string"},"maxItems":100,"title":"Skippedtrackids","type":"array"},"repeat":{"default":"off","enum":["off","all","one"],"title":"Repeat","type":"string"},"shuffle":{"default":false,"title":"Shuffle","type":"boolean"}},"title":"Playlist","type":"object"};

function validate106(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate106.evaluated;
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
if(!((((key0 === "trackIds") || (key0 === "skippedTrackIds")) || (key0 === "repeat")) || (key0 === "shuffle"))){
validate106.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.trackIds !== undefined){
let data0 = data.trackIds;
const _errs2 = errors;
if(errors === _errs2){
if(Array.isArray(data0)){
if(data0.length > 100){
validate106.errors = [{instancePath:instancePath+"/trackIds",schemaPath:"#/properties/trackIds/maxItems",keyword:"maxItems",params:{limit: 100},message:"must NOT have more than 100 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
let data1 = data0[i0];
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate106.errors = [{instancePath:instancePath+"/trackIds/" + i0,schemaPath:"#/properties/trackIds/items/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate106.errors = [{instancePath:instancePath+"/trackIds/" + i0,schemaPath:"#/properties/trackIds/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid1 = _errs4 === errors;
if(!valid1){
break;
}
}
}
}
else {
validate106.errors = [{instancePath:instancePath+"/trackIds",schemaPath:"#/properties/trackIds/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.skippedTrackIds !== undefined){
let data2 = data.skippedTrackIds;
const _errs6 = errors;
if(errors === _errs6){
if(Array.isArray(data2)){
if(data2.length > 100){
validate106.errors = [{instancePath:instancePath+"/skippedTrackIds",schemaPath:"#/properties/skippedTrackIds/maxItems",keyword:"maxItems",params:{limit: 100},message:"must NOT have more than 100 items"}];
return false;
}
else {
var valid2 = true;
const len1 = data2.length;
for(let i1=0; i1<len1; i1++){
let data3 = data2[i1];
const _errs8 = errors;
if(errors === _errs8){
if(errors === _errs8){
if(typeof data3 === "string"){
if(!(formats0.test(data3))){
validate106.errors = [{instancePath:instancePath+"/skippedTrackIds/" + i1,schemaPath:"#/properties/skippedTrackIds/items/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate106.errors = [{instancePath:instancePath+"/skippedTrackIds/" + i1,schemaPath:"#/properties/skippedTrackIds/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid2 = _errs8 === errors;
if(!valid2){
break;
}
}
}
}
else {
validate106.errors = [{instancePath:instancePath+"/skippedTrackIds",schemaPath:"#/properties/skippedTrackIds/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.repeat !== undefined){
let data4 = data.repeat;
const _errs10 = errors;
if(typeof data4 !== "string"){
validate106.errors = [{instancePath:instancePath+"/repeat",schemaPath:"#/properties/repeat/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data4 === "off") || (data4 === "all")) || (data4 === "one"))){
validate106.errors = [{instancePath:instancePath+"/repeat",schemaPath:"#/properties/repeat/enum",keyword:"enum",params:{allowedValues: schema48.properties.repeat.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.shuffle !== undefined){
const _errs12 = errors;
if(typeof data.shuffle !== "boolean"){
validate106.errors = [{instancePath:instancePath+"/shuffle",schemaPath:"#/properties/shuffle/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
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
else {
validate106.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate106.errors = vErrors;
return errors === 0;
}
validate106.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


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
if((((((data.room === undefined) && (missing0 = "room")) || ((data.participants === undefined) && (missing0 = "participants"))) || ((data.playback === undefined) && (missing0 = "playback"))) || ((data.presenceSeq === undefined) && (missing0 = "presenceSeq"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))){
validate95.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "room") || (key0 === "participants")) || (key0 === "playback")) || (key0 === "presenceSeq")) || (key0 === "playbackRevision")) || (key0 === "playlist"))){
validate95.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.room !== undefined){
const _errs2 = errors;
if(!(validate96(data.room, {instancePath:instancePath+"/room",parentData:data,parentDataProperty:"room",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate96.errors : vErrors.concat(validate96.errors);
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
if(!(validate98(data1[i0], {instancePath:instancePath+"/participants/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate98.errors : vErrors.concat(validate98.errors);
errors = vErrors.length;
}
var valid1 = _errs5 === errors;
if(!valid1){
break;
}
}
}
else {
validate95.errors = [{instancePath:instancePath+"/participants",schemaPath:"#/properties/participants/type",keyword:"type",params:{type: "array"},message:"must be array"}];
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
if(!(validate102(data.playback, {instancePath:instancePath+"/playback",parentData:data,parentDataProperty:"playback",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate102.errors : vErrors.concat(validate102.errors);
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
validate95.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs7){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate95.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 0 || isNaN(data4)){
validate95.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate95.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 9007199254740991 || isNaN(data5)){
validate95.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate95.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
if(valid0){
if(data.playlist !== undefined){
const _errs11 = errors;
if(!(validate106(data.playlist, {instancePath:instancePath+"/playlist",parentData:data,parentDataProperty:"playlist",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate106.errors : vErrors.concat(validate106.errors);
errors = vErrors.length;
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
if((((data.connectionId === undefined) && (missing0 = "connectionId")) || ((data.epoch === undefined) && (missing0 = "epoch"))) || ((data.snapshot === undefined) && (missing0 = "snapshot"))){
validate94.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "connectionId") || (key0 === "epoch")) || (key0 === "protocolVersion")) || (key0 === "snapshot"))){
validate94.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate94.errors = [{instancePath:instancePath+"/connectionId",schemaPath:"#/properties/connectionId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate94.errors = [{instancePath:instancePath+"/connectionId",schemaPath:"#/properties/connectionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate94.errors = [{instancePath:instancePath+"/epoch",schemaPath:"#/properties/epoch/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate94.errors = [{instancePath:instancePath+"/epoch",schemaPath:"#/properties/epoch/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate94.errors = [{instancePath:instancePath+"/protocolVersion",schemaPath:"#/properties/protocolVersion/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data2){
validate94.errors = [{instancePath:instancePath+"/protocolVersion",schemaPath:"#/properties/protocolVersion/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
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
if(!(validate95(data.snapshot, {instancePath:instancePath+"/snapshot",parentData:data,parentDataProperty:"snapshot",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate95.errors : vErrors.concat(validate95.errors);
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
validate94.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate94.errors = vErrors;
return errors === 0;
}
validate94.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate93(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate93.evaluated;
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
validate93.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate93.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate93.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate93.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
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
validate93.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate93.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate93.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate93.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate93.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate93.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate93.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate93.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate93.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("hello" !== data4){
validate93.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "hello"},message:"must be equal to constant"}];
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
if(!(validate94(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate94.errors : vErrors.concat(validate94.errors);
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
validate93.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate93.errors = vErrors;
return errors === 0;
}
validate93.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema49 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"room.snapshot","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/Snapshot"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"RoomSnapshot","type":"object"};

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
if("room.snapshot" !== data4){
validate111.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "room.snapshot"},message:"must be equal to constant"}];
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
if(!(validate95(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate95.errors : vErrors.concat(validate95.errors);
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

const schema50 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"playback.state","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/Playback"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"PlaybackState","type":"object"};

function validate114(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate114.evaluated;
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
validate114.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate114.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate114.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate114.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
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
validate114.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate114.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate114.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate114.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate114.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate114.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate114.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate114.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate114.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("playback.state" !== data4){
validate114.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "playback.state"},message:"must be equal to constant"}];
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
if(!(validate102(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate102.errors : vErrors.concat(validate102.errors);
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
validate114.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate114.errors = vErrors;
return errors === 0;
}
validate114.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema51 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"clock.reply","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ClockReplyPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"ClockReply","type":"object"};
const schema52 = {"additionalProperties":false,"properties":{"clientSentAtMs":{"maximum":9007199254740991,"minimum":0,"title":"Clientsentatms","type":"integer"},"probeId":{"format":"uuid","title":"Probeid","type":"string"},"serverReceivedAtMs":{"maximum":9007199254740991,"minimum":0,"title":"Serverreceivedatms","type":"integer"},"serverSentAtMs":{"maximum":9007199254740991,"minimum":0,"title":"Serversentatms","type":"integer"}},"required":["clientSentAtMs","probeId","serverReceivedAtMs","serverSentAtMs"],"title":"ClockReplyPayload","type":"object"};

function validate118(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate118.evaluated;
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
validate118.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "clientSentAtMs") || (key0 === "probeId")) || (key0 === "serverReceivedAtMs")) || (key0 === "serverSentAtMs"))){
validate118.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.clientSentAtMs !== undefined){
let data0 = data.clientSentAtMs;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate118.errors = [{instancePath:instancePath+"/clientSentAtMs",schemaPath:"#/properties/clientSentAtMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs2){
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 > 9007199254740991 || isNaN(data0)){
validate118.errors = [{instancePath:instancePath+"/clientSentAtMs",schemaPath:"#/properties/clientSentAtMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data0 < 0 || isNaN(data0)){
validate118.errors = [{instancePath:instancePath+"/clientSentAtMs",schemaPath:"#/properties/clientSentAtMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate118.errors = [{instancePath:instancePath+"/probeId",schemaPath:"#/properties/probeId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate118.errors = [{instancePath:instancePath+"/probeId",schemaPath:"#/properties/probeId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate118.errors = [{instancePath:instancePath+"/serverReceivedAtMs",schemaPath:"#/properties/serverReceivedAtMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate118.errors = [{instancePath:instancePath+"/serverReceivedAtMs",schemaPath:"#/properties/serverReceivedAtMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate118.errors = [{instancePath:instancePath+"/serverReceivedAtMs",schemaPath:"#/properties/serverReceivedAtMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate118.errors = [{instancePath:instancePath+"/serverSentAtMs",schemaPath:"#/properties/serverSentAtMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate118.errors = [{instancePath:instancePath+"/serverSentAtMs",schemaPath:"#/properties/serverSentAtMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate118.errors = [{instancePath:instancePath+"/serverSentAtMs",schemaPath:"#/properties/serverSentAtMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate118.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate118.errors = vErrors;
return errors === 0;
}
validate118.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate117(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate117.evaluated;
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
validate117.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate117.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate117.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate117.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
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
validate117.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate117.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate117.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate117.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate117.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate117.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate117.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate117.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate117.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("clock.reply" !== data4){
validate117.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "clock.reply"},message:"must be equal to constant"}];
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
if(!(validate118(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate118.errors : vErrors.concat(validate118.errors);
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
validate117.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate117.errors = vErrors;
return errors === 0;
}
validate117.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema53 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"heartbeat.ping","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/PingPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"HeartbeatPing","type":"object"};
const schema54 = {"additionalProperties":false,"properties":{"pingId":{"format":"uuid","title":"Pingid","type":"string"}},"required":["pingId"],"title":"PingPayload","type":"object"};

function validate122(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate122.evaluated;
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
validate122.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "pingId")){
validate122.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate122.errors = [{instancePath:instancePath+"/pingId",schemaPath:"#/properties/pingId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate122.errors = [{instancePath:instancePath+"/pingId",schemaPath:"#/properties/pingId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
}
}
}
}
else {
validate122.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate122.errors = vErrors;
return errors === 0;
}
validate122.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate121(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate121.evaluated;
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
validate121.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate121.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate121.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate121.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
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
validate121.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate121.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate121.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate121.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate121.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate121.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate121.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate121.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate121.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("heartbeat.ping" !== data4){
validate121.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "heartbeat.ping"},message:"must be equal to constant"}];
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
if(!(validate122(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate122.errors : vErrors.concat(validate122.errors);
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
validate121.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate121.errors = vErrors;
return errors === 0;
}
validate121.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema55 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"presence.changed","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/PresencePayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"PresenceChanged","type":"object"};
const schema56 = {"additionalProperties":false,"properties":{"presenceSeq":{"maximum":9007199254740991,"minimum":0,"title":"Presenceseq","type":"integer"},"participants":{"items":{"$ref":"#/$defs/Participant"},"title":"Participants","type":"array"}},"required":["presenceSeq","participants"],"title":"PresencePayload","type":"object"};

function validate126(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate126.evaluated;
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
validate126.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "presenceSeq") || (key0 === "participants"))){
validate126.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.presenceSeq !== undefined){
let data0 = data.presenceSeq;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate126.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs2){
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 > 9007199254740991 || isNaN(data0)){
validate126.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data0 < 0 || isNaN(data0)){
validate126.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
if(!(validate98(data1[i0], {instancePath:instancePath+"/participants/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate98.errors : vErrors.concat(validate98.errors);
errors = vErrors.length;
}
var valid1 = _errs6 === errors;
if(!valid1){
break;
}
}
}
else {
validate126.errors = [{instancePath:instancePath+"/participants",schemaPath:"#/properties/participants/type",keyword:"type",params:{type: "array"},message:"must be array"}];
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
validate126.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate126.errors = vErrors;
return errors === 0;
}
validate126.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


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
if(((((((data.v === undefined) && (missing0 = "v")) || ((data.eventId === undefined) && (missing0 = "eventId"))) || ((data.serverTimeMs === undefined) && (missing0 = "serverTimeMs"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate125.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate125.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate125.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate125.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
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
validate125.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate125.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate125.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate125.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate125.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate125.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate125.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate125.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate125.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("presence.changed" !== data4){
validate125.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "presence.changed"},message:"must be equal to constant"}];
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
if(!(validate126(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate126.errors : vErrors.concat(validate126.errors);
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
validate125.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate125.errors = vErrors;
return errors === 0;
}
validate125.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema57 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"host.changed","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/HostPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"HostChanged","type":"object"};
const schema58 = {"additionalProperties":false,"properties":{"participantId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Participantid"}},"required":["participantId"],"title":"HostPayload","type":"object"};

function validate131(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate131.evaluated;
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
validate131.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "participantId")){
validate131.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate131.errors = vErrors;
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
validate131.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate131.errors = vErrors;
return errors === 0;
}
validate131.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


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
if(((((((data.v === undefined) && (missing0 = "v")) || ((data.eventId === undefined) && (missing0 = "eventId"))) || ((data.serverTimeMs === undefined) && (missing0 = "serverTimeMs"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate130.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate130.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate130.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate130.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
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
validate130.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate130.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate130.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate130.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate130.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate130.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate130.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate130.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate130.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("host.changed" !== data4){
validate130.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "host.changed"},message:"must be equal to constant"}];
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
if(!(validate131(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate131.errors : vErrors.concat(validate131.errors);
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
validate130.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate130.errors = vErrors;
return errors === 0;
}
validate130.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema59 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"track.updated","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/TrackPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"TrackUpdated","type":"object"};
const schema60 = {"additionalProperties":false,"properties":{"track":{"$ref":"#/$defs/Track"}},"required":["track"],"title":"TrackPayload","type":"object"};
const schema61 = {"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"title":{"title":"Title","type":"string"},"artist":{"title":"Artist","type":"string"},"durationMs":{"anyOf":[{"maximum":900000,"minimum":0,"type":"integer"},{"type":"null"}],"title":"Durationms"},"status":{"enum":["uploading","processing","ready","failed"],"title":"Status","type":"string"},"errorCode":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Errorcode"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Mediaversion"},"coverUrl":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Coverurl"},"sourceUri":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Sourceuri"},"licenseId":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Licenseid"},"licenseUri":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Licenseuri"}},"required":["id","title","artist","durationMs","status"],"title":"Track","type":"object"};

function validate136(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate136.evaluated;
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
validate136.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema61.properties, key0))){
validate136.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate136.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate136.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate136.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate136.errors = [{instancePath:instancePath+"/artist",schemaPath:"#/properties/artist/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate136.errors = vErrors;
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
validate136.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((((data4 === "uploading") || (data4 === "processing")) || (data4 === "ready")) || (data4 === "failed"))){
validate136.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema61.properties.status.enum},message:"must be equal to one of the allowed values"}];
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
validate136.errors = vErrors;
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
validate136.errors = vErrors;
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
validate136.errors = vErrors;
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
validate136.errors = vErrors;
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
validate136.errors = vErrors;
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
validate136.errors = vErrors;
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
validate136.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate136.errors = vErrors;
return errors === 0;
}
validate136.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


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
if((data.track === undefined) && (missing0 = "track")){
validate135.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "track")){
validate135.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.track !== undefined){
if(!(validate136(data.track, {instancePath:instancePath+"/track",parentData:data,parentDataProperty:"track",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate136.errors : vErrors.concat(validate136.errors);
errors = vErrors.length;
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
if("track.updated" !== data4){
validate134.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "track.updated"},message:"must be equal to constant"}];
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

const schema62 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"room.closed","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ClosedPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"RoomClosed","type":"object"};
const schema63 = {"additionalProperties":false,"properties":{"reason":{"enum":["closedByHost","expired","emptyTimeout"],"title":"Reason","type":"string"}},"required":["reason"],"title":"ClosedPayload","type":"object"};

function validate141(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate141.evaluated;
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
validate141.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "reason")){
validate141.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.reason !== undefined){
let data0 = data.reason;
if(typeof data0 !== "string"){
validate141.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data0 === "closedByHost") || (data0 === "expired")) || (data0 === "emptyTimeout"))){
validate141.errors = [{instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/enum",keyword:"enum",params:{allowedValues: schema63.properties.reason.enum},message:"must be equal to one of the allowed values"}];
return false;
}
}
}
}
}
else {
validate141.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate141.errors = vErrors;
return errors === 0;
}
validate141.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate140(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate140.evaluated;
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
validate140.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate140.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate140.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate140.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
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
validate140.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate140.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate140.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate140.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate140.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate140.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate140.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate140.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate140.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("room.closed" !== data4){
validate140.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "room.closed"},message:"must be equal to constant"}];
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
if(!(validate141(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate141.errors : vErrors.concat(validate141.errors);
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
validate140.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate140.errors = vErrors;
return errors === 0;
}
validate140.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema64 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"command.ack","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/AckPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"CommandAck","type":"object"};
const schema65 = {"additionalProperties":false,"properties":{"requestId":{"format":"uuid","title":"Requestid","type":"string"},"acceptedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Acceptedplaybackrevision","type":"integer"},"effectiveAtServerTimeMs":{"anyOf":[{"maximum":9007199254740991,"minimum":0,"type":"integer"},{"type":"null"}],"default":null,"title":"Effectiveatservertimems"}},"required":["requestId","acceptedPlaybackRevision"],"title":"AckPayload","type":"object"};

function validate145(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate145.evaluated;
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
validate145.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "requestId") || (key0 === "acceptedPlaybackRevision")) || (key0 === "effectiveAtServerTimeMs"))){
validate145.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate145.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate145.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate145.errors = [{instancePath:instancePath+"/acceptedPlaybackRevision",schemaPath:"#/properties/acceptedPlaybackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs4){
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 > 9007199254740991 || isNaN(data1)){
validate145.errors = [{instancePath:instancePath+"/acceptedPlaybackRevision",schemaPath:"#/properties/acceptedPlaybackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data1 < 0 || isNaN(data1)){
validate145.errors = [{instancePath:instancePath+"/acceptedPlaybackRevision",schemaPath:"#/properties/acceptedPlaybackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate145.errors = vErrors;
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
validate145.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate145.errors = vErrors;
return errors === 0;
}
validate145.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate144(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate144.evaluated;
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
validate144.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate144.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate144.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate144.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
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
validate144.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate144.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate144.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate144.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate144.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate144.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate144.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate144.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate144.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("command.ack" !== data4){
validate144.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "command.ack"},message:"must be equal to constant"}];
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
if(!(validate145(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate145.errors : vErrors.concat(validate145.errors);
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
validate144.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate144.errors = vErrors;
return errors === 0;
}
validate144.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema66 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"command.error","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ErrorPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"CommandError","type":"object"};
const schema67 = {"additionalProperties":false,"properties":{"requestId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Requestid"},"code":{"title":"Code","type":"string"},"message":{"title":"Message","type":"string"},"snapshot":{"anyOf":[{"$ref":"#/$defs/Snapshot"},{"type":"null"}],"default":null}},"required":["requestId","code","message"],"title":"ErrorPayload","type":"object"};

function validate149(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate149.evaluated;
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
validate149.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "requestId") || (key0 === "code")) || (key0 === "message")) || (key0 === "snapshot"))){
validate149.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate149.errors = vErrors;
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
validate149.errors = [{instancePath:instancePath+"/code",schemaPath:"#/properties/code/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate149.errors = [{instancePath:instancePath+"/message",schemaPath:"#/properties/message/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
if(!(validate95(data3, {instancePath:instancePath+"/snapshot",parentData:data,parentDataProperty:"snapshot",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate95.errors : vErrors.concat(validate95.errors);
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
validate149.errors = vErrors;
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
validate149.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate149.errors = vErrors;
return errors === 0;
}
validate149.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate148(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate148.evaluated;
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
validate148.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate148.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate148.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate148.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
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
validate148.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate148.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate148.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate148.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate148.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate148.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate148.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate148.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate148.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("command.error" !== data4){
validate148.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "command.error"},message:"must be equal to constant"}];
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
if(!(validate149(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate149.errors : vErrors.concat(validate149.errors);
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
validate148.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate148.errors = vErrors;
return errors === 0;
}
validate148.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema68 = {"additionalProperties":false,"properties":{"v":{"const":1,"title":"V","type":"integer"},"eventId":{"format":"uuid","title":"Eventid","type":"string"},"serverTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Servertimems","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"type":{"const":"reaction.created","title":"Type","type":"string"},"payload":{"$ref":"#/$defs/ReactionCreatedPayload"}},"required":["v","eventId","serverTimeMs","playbackRevision","type","payload"],"title":"ReactionCreated","type":"object"};
const schema69 = {"additionalProperties":false,"properties":{"emoji":{"enum":["❤️","🔥","👏","✨","🎶","😂"],"title":"Emoji","type":"string"},"participantId":{"format":"uuid","title":"Participantid","type":"string"}},"required":["emoji","participantId"],"title":"ReactionCreatedPayload","type":"object"};

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
if(((data.emoji === undefined) && (missing0 = "emoji")) || ((data.participantId === undefined) && (missing0 = "participantId"))){
validate154.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "emoji") || (key0 === "participantId"))){
validate154.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.emoji !== undefined){
let data0 = data.emoji;
const _errs2 = errors;
if(typeof data0 !== "string"){
validate154.errors = [{instancePath:instancePath+"/emoji",schemaPath:"#/properties/emoji/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((((((data0 === "❤️") || (data0 === "🔥")) || (data0 === "👏")) || (data0 === "✨")) || (data0 === "🎶")) || (data0 === "😂"))){
validate154.errors = [{instancePath:instancePath+"/emoji",schemaPath:"#/properties/emoji/enum",keyword:"enum",params:{allowedValues: schema69.properties.emoji.enum},message:"must be equal to one of the allowed values"}];
return false;
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
validate154.errors = [{instancePath:instancePath+"/participantId",schemaPath:"#/properties/participantId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate154.errors = [{instancePath:instancePath+"/participantId",schemaPath:"#/properties/participantId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate154.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate154.errors = vErrors;
return errors === 0;
}
validate154.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


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
if(((((((data.v === undefined) && (missing0 = "v")) || ((data.eventId === undefined) && (missing0 = "eventId"))) || ((data.serverTimeMs === undefined) && (missing0 = "serverTimeMs"))) || ((data.playbackRevision === undefined) && (missing0 = "playbackRevision"))) || ((data.type === undefined) && (missing0 = "type"))) || ((data.payload === undefined) && (missing0 = "payload"))){
validate153.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "v") || (key0 === "eventId")) || (key0 === "serverTimeMs")) || (key0 === "playbackRevision")) || (key0 === "type")) || (key0 === "payload"))){
validate153.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.v !== undefined){
let data0 = data.v;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate153.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data0){
validate153.errors = [{instancePath:instancePath+"/v",schemaPath:"#/properties/v/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
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
validate153.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate153.errors = [{instancePath:instancePath+"/eventId",schemaPath:"#/properties/eventId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate153.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate153.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate153.errors = [{instancePath:instancePath+"/serverTimeMs",schemaPath:"#/properties/serverTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate153.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate153.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate153.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate153.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("reaction.created" !== data4){
validate153.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "reaction.created"},message:"must be equal to constant"}];
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
if(!(validate154(data.payload, {instancePath:instancePath+"/payload",parentData:data,parentDataProperty:"payload",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate154.errors : vErrors.concat(validate154.errors);
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
validate153.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate153.errors = vErrors;
return errors === 0;
}
validate153.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate92(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="urn:unison:server-event-v1" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate92.evaluated;
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
if(!(validate93(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate93.errors : vErrors.concat(validate93.errors);
errors = vErrors.length;
}
var _valid0 = _errs1 === errors;
if(_valid0){
valid0 = true;
passing0 = 0;
var props0 = true;
}
const _errs2 = errors;
if(!(validate111(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate111.errors : vErrors.concat(validate111.errors);
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
if(!(validate114(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate114.errors : vErrors.concat(validate114.errors);
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
if(!(validate117(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate117.errors : vErrors.concat(validate117.errors);
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
if(!(validate121(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate121.errors : vErrors.concat(validate121.errors);
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
if(!(validate125(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate125.errors : vErrors.concat(validate125.errors);
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
if(!(validate130(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate130.errors : vErrors.concat(validate130.errors);
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
if(!(validate134(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate134.errors : vErrors.concat(validate134.errors);
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
if(!(validate140(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate140.errors : vErrors.concat(validate140.errors);
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
if(!(validate144(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate144.errors : vErrors.concat(validate144.errors);
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
if(!(validate148(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate148.errors : vErrors.concat(validate148.errors);
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
const _errs12 = errors;
if(!(validate153(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate153.errors : vErrors.concat(validate153.errors);
errors = vErrors.length;
}
var _valid0 = _errs12 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 11];
}
else {
if(_valid0){
valid0 = true;
passing0 = 11;
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
validate92.errors = vErrors;
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
validate92.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate92.evaluated = {"dynamicProps":true,"dynamicItems":false};

export const httpBootstrap = validate239;
const schema71 = {"additionalProperties":false,"properties":{"csrfToken":{"title":"Csrftoken","type":"string"},"protocolVersion":{"const":1,"default":1,"title":"Protocolversion","type":"integer"},"limits":{"additionalProperties":{"type":"integer"},"title":"Limits","type":"object"}},"required":["csrfToken","limits"],"title":"Bootstrap","type":"object"};

function validate239(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate239.evaluated;
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
validate239.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "csrfToken") || (key0 === "protocolVersion")) || (key0 === "limits"))){
validate239.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.csrfToken !== undefined){
const _errs2 = errors;
if(typeof data.csrfToken !== "string"){
validate239.errors = [{instancePath:instancePath+"/csrfToken",schemaPath:"#/properties/csrfToken/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate239.errors = [{instancePath:instancePath+"/protocolVersion",schemaPath:"#/properties/protocolVersion/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(1 !== data1){
validate239.errors = [{instancePath:instancePath+"/protocolVersion",schemaPath:"#/properties/protocolVersion/const",keyword:"const",params:{allowedValue: 1},message:"must be equal to constant"}];
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
validate239.errors = [{instancePath:instancePath+"/limits/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/limits/additionalProperties/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
var valid1 = _errs9 === errors;
if(!valid1){
break;
}
}
}
else {
validate239.errors = [{instancePath:instancePath+"/limits",schemaPath:"#/properties/limits/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate239.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate239.errors = vErrors;
return errors === 0;
}
validate239.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpCreateRoom = validate240;
const schema72 = {"additionalProperties":false,"properties":{"displayName":{"maxLength":32,"minLength":1,"title":"Displayname","type":"string"},"title":{"default":"Музыкальная комната","maxLength":64,"minLength":1,"title":"Title","type":"string"},"capacity":{"default":2,"maximum":10,"minimum":2,"title":"Capacity","type":"integer"},"moderated":{"default":false,"title":"Moderated","type":"boolean"}},"required":["displayName"],"title":"CreateRoom","type":"object"};

function validate240(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate240.evaluated;
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
validate240.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "displayName") || (key0 === "title")) || (key0 === "capacity")) || (key0 === "moderated"))){
validate240.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate240.errors = [{instancePath:instancePath+"/displayName",schemaPath:"#/properties/displayName/maxLength",keyword:"maxLength",params:{limit: 32},message:"must NOT have more than 32 characters"}];
return false;
}
else {
if(func1(data0) < 1){
validate240.errors = [{instancePath:instancePath+"/displayName",schemaPath:"#/properties/displayName/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate240.errors = [{instancePath:instancePath+"/displayName",schemaPath:"#/properties/displayName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate240.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/maxLength",keyword:"maxLength",params:{limit: 64},message:"must NOT have more than 64 characters"}];
return false;
}
else {
if(func1(data1) < 1){
validate240.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate240.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.capacity !== undefined){
let data2 = data.capacity;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate240.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 10 || isNaN(data2)){
validate240.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10},message:"must be <= 10"}];
return false;
}
else {
if(data2 < 2 || isNaN(data2)){
validate240.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 2},message:"must be >= 2"}];
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
if(data.moderated !== undefined){
const _errs8 = errors;
if(typeof data.moderated !== "boolean"){
validate240.errors = [{instancePath:instancePath+"/moderated",schemaPath:"#/properties/moderated/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
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
validate240.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate240.errors = vErrors;
return errors === 0;
}
validate240.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpCreateRoomResult = validate241;
const schema73 = {"additionalProperties":false,"properties":{"roomId":{"format":"uuid","title":"Roomid","type":"string"},"participantId":{"format":"uuid","title":"Participantid","type":"string"},"inviteUrl":{"title":"Inviteurl","type":"string"},"expiresAt":{"maximum":9007199254740991,"minimum":0,"title":"Expiresat","type":"integer"},"snapshot":{"$ref":"#/$defs/Snapshot"}},"required":["roomId","participantId","inviteUrl","expiresAt","snapshot"],"title":"CreateRoomResult","type":"object"};
const schema74 = {"additionalProperties":false,"properties":{"room":{"$ref":"#/$defs/Room"},"participants":{"items":{"$ref":"#/$defs/Participant"},"title":"Participants","type":"array"},"playback":{"$ref":"#/$defs/Playback"},"presenceSeq":{"maximum":9007199254740991,"minimum":0,"title":"Presenceseq","type":"integer"},"playbackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Playbackrevision","type":"integer"},"playlist":{"$ref":"#/$defs/Playlist"}},"required":["room","participants","playback","presenceSeq","playbackRevision"],"title":"Snapshot","type":"object"};
const schema75 = {"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"title":{"title":"Title","type":"string"},"status":{"enum":["active","closed","expired"],"title":"Status","type":"string"},"capacity":{"maximum":10,"minimum":2,"title":"Capacity","type":"integer"},"expiresAt":{"maximum":9007199254740991,"minimum":0,"title":"Expiresat","type":"integer"},"hostParticipantId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Hostparticipantid"},"moderated":{"default":false,"title":"Moderated","type":"boolean"}},"required":["id","title","status","capacity","expiresAt","hostParticipantId"],"title":"Room","type":"object"};

function validate164(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate164.evaluated;
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
validate164.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((((key0 === "id") || (key0 === "title")) || (key0 === "status")) || (key0 === "capacity")) || (key0 === "expiresAt")) || (key0 === "hostParticipantId")) || (key0 === "moderated"))){
validate164.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate164.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate164.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate164.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate164.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data2 === "active") || (data2 === "closed")) || (data2 === "expired"))){
validate164.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema75.properties.status.enum},message:"must be equal to one of the allowed values"}];
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
validate164.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 10 || isNaN(data3)){
validate164.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10},message:"must be <= 10"}];
return false;
}
else {
if(data3 < 2 || isNaN(data3)){
validate164.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 2},message:"must be >= 2"}];
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
validate164.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs10){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate164.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 0 || isNaN(data4)){
validate164.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate164.errors = vErrors;
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
if(data.moderated !== undefined){
const _errs18 = errors;
if(typeof data.moderated !== "boolean"){
validate164.errors = [{instancePath:instancePath+"/moderated",schemaPath:"#/properties/moderated/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs18 === errors;
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
else {
validate164.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate164.errors = vErrors;
return errors === 0;
}
validate164.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema76 = {"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"displayName":{"title":"Displayname","type":"string"},"role":{"enum":["host","listener"],"title":"Role","type":"string"},"connectionState":{"enum":["online","offline","connecting"],"title":"Connectionstate","type":"string"},"readiness":{"anyOf":[{"$ref":"#/$defs/Readiness"},{"type":"null"}]},"canEdit":{"default":false,"title":"Canedit","type":"boolean"}},"required":["id","displayName","role","connectionState","readiness"],"title":"Participant","type":"object"};
const schema77 = {"additionalProperties":false,"properties":{"trackId":{"format":"uuid","title":"Trackid","type":"string"},"mediaVersion":{"maxLength":128,"minLength":1,"title":"Mediaversion","type":"string"},"state":{"enum":["loading","ready","buffering","autoplayBlocked","error"],"title":"State","type":"string"},"bufferedAheadMs":{"maximum":900000,"minimum":0,"title":"Bufferedaheadms","type":"integer"},"autoplayAllowed":{"title":"Autoplayallowed","type":"boolean"}},"required":["trackId","mediaVersion","state","bufferedAheadMs","autoplayAllowed"],"title":"Readiness","type":"object"};

function validate167(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate167.evaluated;
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
validate167.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "trackId") || (key0 === "mediaVersion")) || (key0 === "state")) || (key0 === "bufferedAheadMs")) || (key0 === "autoplayAllowed"))){
validate167.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate167.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate167.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate167.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/maxLength",keyword:"maxLength",params:{limit: 128},message:"must NOT have more than 128 characters"}];
return false;
}
else {
if(func1(data1) < 1){
validate167.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate167.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate167.errors = [{instancePath:instancePath+"/state",schemaPath:"#/properties/state/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((((data2 === "loading") || (data2 === "ready")) || (data2 === "buffering")) || (data2 === "autoplayBlocked")) || (data2 === "error"))){
validate167.errors = [{instancePath:instancePath+"/state",schemaPath:"#/properties/state/enum",keyword:"enum",params:{allowedValues: schema77.properties.state.enum},message:"must be equal to one of the allowed values"}];
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
validate167.errors = [{instancePath:instancePath+"/bufferedAheadMs",schemaPath:"#/properties/bufferedAheadMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 900000 || isNaN(data3)){
validate167.errors = [{instancePath:instancePath+"/bufferedAheadMs",schemaPath:"#/properties/bufferedAheadMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate167.errors = [{instancePath:instancePath+"/bufferedAheadMs",schemaPath:"#/properties/bufferedAheadMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate167.errors = [{instancePath:instancePath+"/autoplayAllowed",schemaPath:"#/properties/autoplayAllowed/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate167.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate167.errors = vErrors;
return errors === 0;
}
validate167.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate166(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate166.evaluated;
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
validate166.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "id") || (key0 === "displayName")) || (key0 === "role")) || (key0 === "connectionState")) || (key0 === "readiness")) || (key0 === "canEdit"))){
validate166.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate166.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate166.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate166.errors = [{instancePath:instancePath+"/displayName",schemaPath:"#/properties/displayName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate166.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((data2 === "host") || (data2 === "listener"))){
validate166.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/enum",keyword:"enum",params:{allowedValues: schema76.properties.role.enum},message:"must be equal to one of the allowed values"}];
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
validate166.errors = [{instancePath:instancePath+"/connectionState",schemaPath:"#/properties/connectionState/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data3 === "online") || (data3 === "offline")) || (data3 === "connecting"))){
validate166.errors = [{instancePath:instancePath+"/connectionState",schemaPath:"#/properties/connectionState/enum",keyword:"enum",params:{allowedValues: schema76.properties.connectionState.enum},message:"must be equal to one of the allowed values"}];
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
if(!(validate167(data4, {instancePath:instancePath+"/readiness",parentData:data,parentDataProperty:"readiness",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate167.errors : vErrors.concat(validate167.errors);
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
validate166.errors = vErrors;
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
if(data.canEdit !== undefined){
const _errs15 = errors;
if(typeof data.canEdit !== "boolean"){
validate166.errors = [{instancePath:instancePath+"/canEdit",schemaPath:"#/properties/canEdit/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs15 === errors;
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
validate166.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate166.errors = vErrors;
return errors === 0;
}
validate166.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema78 = {"additionalProperties":false,"properties":{"roomId":{"format":"uuid","title":"Roomid","type":"string"},"epoch":{"format":"uuid","title":"Epoch","type":"string"},"trackId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"title":"Trackid"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Mediaversion"},"status":{"enum":["empty","paused","playing","ended"],"title":"Status","type":"string"},"positionMs":{"maximum":900000,"minimum":0,"title":"Positionms","type":"integer"},"anchorServerTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Anchorservertimems","type":"integer"},"durationMs":{"maximum":900000,"minimum":0,"title":"Durationms","type":"integer"},"pendingTransition":{"anyOf":[{"$ref":"#/$defs/PendingTransition"},{"type":"null"}]}},"required":["roomId","epoch","trackId","mediaVersion","status","positionMs","anchorServerTimeMs","durationMs","pendingTransition"],"title":"Playback","type":"object"};
const schema79 = {"additionalProperties":false,"properties":{"type":{"enum":["play","pause","seek"],"title":"Type","type":"string"},"nextStatus":{"enum":["paused","playing","ended"],"title":"Nextstatus","type":"string"},"positionMs":{"maximum":900000,"minimum":0,"title":"Positionms","type":"integer"},"effectiveAtServerTimeMs":{"maximum":9007199254740991,"minimum":0,"title":"Effectiveatservertimems","type":"integer"},"trackId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"default":null,"title":"Trackid"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Mediaversion"}},"required":["type","nextStatus","positionMs","effectiveAtServerTimeMs"],"title":"PendingTransition","type":"object"};

function validate171(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate171.evaluated;
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
validate171.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "type") || (key0 === "nextStatus")) || (key0 === "positionMs")) || (key0 === "effectiveAtServerTimeMs")) || (key0 === "trackId")) || (key0 === "mediaVersion"))){
validate171.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.type !== undefined){
let data0 = data.type;
const _errs2 = errors;
if(typeof data0 !== "string"){
validate171.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data0 === "play") || (data0 === "pause")) || (data0 === "seek"))){
validate171.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/enum",keyword:"enum",params:{allowedValues: schema79.properties.type.enum},message:"must be equal to one of the allowed values"}];
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
validate171.errors = [{instancePath:instancePath+"/nextStatus",schemaPath:"#/properties/nextStatus/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data1 === "paused") || (data1 === "playing")) || (data1 === "ended"))){
validate171.errors = [{instancePath:instancePath+"/nextStatus",schemaPath:"#/properties/nextStatus/enum",keyword:"enum",params:{allowedValues: schema79.properties.nextStatus.enum},message:"must be equal to one of the allowed values"}];
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
validate171.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 900000 || isNaN(data2)){
validate171.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate171.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate171.errors = [{instancePath:instancePath+"/effectiveAtServerTimeMs",schemaPath:"#/properties/effectiveAtServerTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate171.errors = [{instancePath:instancePath+"/effectiveAtServerTimeMs",schemaPath:"#/properties/effectiveAtServerTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate171.errors = [{instancePath:instancePath+"/effectiveAtServerTimeMs",schemaPath:"#/properties/effectiveAtServerTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate171.errors = vErrors;
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
validate171.errors = vErrors;
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
validate171.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate171.errors = vErrors;
return errors === 0;
}
validate171.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate170(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate170.evaluated;
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
validate170.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema78.properties, key0))){
validate170.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate170.errors = [{instancePath:instancePath+"/roomId",schemaPath:"#/properties/roomId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate170.errors = [{instancePath:instancePath+"/roomId",schemaPath:"#/properties/roomId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate170.errors = [{instancePath:instancePath+"/epoch",schemaPath:"#/properties/epoch/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate170.errors = [{instancePath:instancePath+"/epoch",schemaPath:"#/properties/epoch/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate170.errors = vErrors;
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
validate170.errors = vErrors;
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
validate170.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((((data4 === "empty") || (data4 === "paused")) || (data4 === "playing")) || (data4 === "ended"))){
validate170.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema78.properties.status.enum},message:"must be equal to one of the allowed values"}];
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
validate170.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs20){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 900000 || isNaN(data5)){
validate170.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate170.errors = [{instancePath:instancePath+"/positionMs",schemaPath:"#/properties/positionMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate170.errors = [{instancePath:instancePath+"/anchorServerTimeMs",schemaPath:"#/properties/anchorServerTimeMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs22){
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 > 9007199254740991 || isNaN(data6)){
validate170.errors = [{instancePath:instancePath+"/anchorServerTimeMs",schemaPath:"#/properties/anchorServerTimeMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data6 < 0 || isNaN(data6)){
validate170.errors = [{instancePath:instancePath+"/anchorServerTimeMs",schemaPath:"#/properties/anchorServerTimeMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate170.errors = [{instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs24){
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 > 900000 || isNaN(data7)){
validate170.errors = [{instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 900000},message:"must be <= 900000"}];
return false;
}
else {
if(data7 < 0 || isNaN(data7)){
validate170.errors = [{instancePath:instancePath+"/durationMs",schemaPath:"#/properties/durationMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
if(!(validate171(data8, {instancePath:instancePath+"/pendingTransition",parentData:data,parentDataProperty:"pendingTransition",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate171.errors : vErrors.concat(validate171.errors);
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
validate170.errors = vErrors;
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
validate170.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate170.errors = vErrors;
return errors === 0;
}
validate170.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema80 = {"additionalProperties":false,"properties":{"trackIds":{"items":{"format":"uuid","type":"string"},"maxItems":100,"title":"Trackids","type":"array"},"skippedTrackIds":{"items":{"format":"uuid","type":"string"},"maxItems":100,"title":"Skippedtrackids","type":"array"},"repeat":{"default":"off","enum":["off","all","one"],"title":"Repeat","type":"string"},"shuffle":{"default":false,"title":"Shuffle","type":"boolean"}},"title":"Playlist","type":"object"};

function validate174(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate174.evaluated;
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
if(!((((key0 === "trackIds") || (key0 === "skippedTrackIds")) || (key0 === "repeat")) || (key0 === "shuffle"))){
validate174.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.trackIds !== undefined){
let data0 = data.trackIds;
const _errs2 = errors;
if(errors === _errs2){
if(Array.isArray(data0)){
if(data0.length > 100){
validate174.errors = [{instancePath:instancePath+"/trackIds",schemaPath:"#/properties/trackIds/maxItems",keyword:"maxItems",params:{limit: 100},message:"must NOT have more than 100 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
let data1 = data0[i0];
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate174.errors = [{instancePath:instancePath+"/trackIds/" + i0,schemaPath:"#/properties/trackIds/items/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate174.errors = [{instancePath:instancePath+"/trackIds/" + i0,schemaPath:"#/properties/trackIds/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid1 = _errs4 === errors;
if(!valid1){
break;
}
}
}
}
else {
validate174.errors = [{instancePath:instancePath+"/trackIds",schemaPath:"#/properties/trackIds/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.skippedTrackIds !== undefined){
let data2 = data.skippedTrackIds;
const _errs6 = errors;
if(errors === _errs6){
if(Array.isArray(data2)){
if(data2.length > 100){
validate174.errors = [{instancePath:instancePath+"/skippedTrackIds",schemaPath:"#/properties/skippedTrackIds/maxItems",keyword:"maxItems",params:{limit: 100},message:"must NOT have more than 100 items"}];
return false;
}
else {
var valid2 = true;
const len1 = data2.length;
for(let i1=0; i1<len1; i1++){
let data3 = data2[i1];
const _errs8 = errors;
if(errors === _errs8){
if(errors === _errs8){
if(typeof data3 === "string"){
if(!(formats0.test(data3))){
validate174.errors = [{instancePath:instancePath+"/skippedTrackIds/" + i1,schemaPath:"#/properties/skippedTrackIds/items/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate174.errors = [{instancePath:instancePath+"/skippedTrackIds/" + i1,schemaPath:"#/properties/skippedTrackIds/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid2 = _errs8 === errors;
if(!valid2){
break;
}
}
}
}
else {
validate174.errors = [{instancePath:instancePath+"/skippedTrackIds",schemaPath:"#/properties/skippedTrackIds/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.repeat !== undefined){
let data4 = data.repeat;
const _errs10 = errors;
if(typeof data4 !== "string"){
validate174.errors = [{instancePath:instancePath+"/repeat",schemaPath:"#/properties/repeat/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data4 === "off") || (data4 === "all")) || (data4 === "one"))){
validate174.errors = [{instancePath:instancePath+"/repeat",schemaPath:"#/properties/repeat/enum",keyword:"enum",params:{allowedValues: schema80.properties.repeat.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.shuffle !== undefined){
const _errs12 = errors;
if(typeof data.shuffle !== "boolean"){
validate174.errors = [{instancePath:instancePath+"/shuffle",schemaPath:"#/properties/shuffle/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
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
else {
validate174.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate174.errors = vErrors;
return errors === 0;
}
validate174.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate163(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate163.evaluated;
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
validate163.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "room") || (key0 === "participants")) || (key0 === "playback")) || (key0 === "presenceSeq")) || (key0 === "playbackRevision")) || (key0 === "playlist"))){
validate163.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.room !== undefined){
const _errs2 = errors;
if(!(validate164(data.room, {instancePath:instancePath+"/room",parentData:data,parentDataProperty:"room",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate164.errors : vErrors.concat(validate164.errors);
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
if(!(validate166(data1[i0], {instancePath:instancePath+"/participants/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate166.errors : vErrors.concat(validate166.errors);
errors = vErrors.length;
}
var valid1 = _errs5 === errors;
if(!valid1){
break;
}
}
}
else {
validate163.errors = [{instancePath:instancePath+"/participants",schemaPath:"#/properties/participants/type",keyword:"type",params:{type: "array"},message:"must be array"}];
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
if(!(validate170(data.playback, {instancePath:instancePath+"/playback",parentData:data,parentDataProperty:"playback",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate170.errors : vErrors.concat(validate170.errors);
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
validate163.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs7){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate163.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 0 || isNaN(data4)){
validate163.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate163.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 9007199254740991 || isNaN(data5)){
validate163.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate163.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
if(valid0){
if(data.playlist !== undefined){
const _errs11 = errors;
if(!(validate174(data.playlist, {instancePath:instancePath+"/playlist",parentData:data,parentDataProperty:"playlist",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate174.errors : vErrors.concat(validate174.errors);
errors = vErrors.length;
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
}
}
else {
validate163.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate163.errors = vErrors;
return errors === 0;
}
validate163.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate241(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate241.evaluated;
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
validate241.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "roomId") || (key0 === "participantId")) || (key0 === "inviteUrl")) || (key0 === "expiresAt")) || (key0 === "snapshot"))){
validate241.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate241.errors = [{instancePath:instancePath+"/roomId",schemaPath:"#/properties/roomId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate241.errors = [{instancePath:instancePath+"/roomId",schemaPath:"#/properties/roomId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate241.errors = [{instancePath:instancePath+"/participantId",schemaPath:"#/properties/participantId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate241.errors = [{instancePath:instancePath+"/participantId",schemaPath:"#/properties/participantId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate241.errors = [{instancePath:instancePath+"/inviteUrl",schemaPath:"#/properties/inviteUrl/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate241.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs8){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 9007199254740991 || isNaN(data3)){
validate241.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data3 < 0 || isNaN(data3)){
validate241.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
if(!(validate163(data.snapshot, {instancePath:instancePath+"/snapshot",parentData:data,parentDataProperty:"snapshot",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate163.errors : vErrors.concat(validate163.errors);
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
validate241.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate241.errors = vErrors;
return errors === 0;
}
validate241.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpPreviewInvite = validate243;
const schema81 = {"additionalProperties":false,"properties":{"inviteToken":{"maxLength":43,"minLength":43,"pattern":"^[A-Za-z0-9_-]+$","title":"Invitetoken","type":"string"}},"required":["inviteToken"],"title":"PreviewInvite","type":"object"};
const pattern3 = new RegExp("^[A-Za-z0-9_-]+$", "u");

function validate243(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate243.evaluated;
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
validate243.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "inviteToken")){
validate243.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate243.errors = [{instancePath:instancePath+"/inviteToken",schemaPath:"#/properties/inviteToken/maxLength",keyword:"maxLength",params:{limit: 43},message:"must NOT have more than 43 characters"}];
return false;
}
else {
if(func1(data0) < 43){
validate243.errors = [{instancePath:instancePath+"/inviteToken",schemaPath:"#/properties/inviteToken/minLength",keyword:"minLength",params:{limit: 43},message:"must NOT have fewer than 43 characters"}];
return false;
}
else {
if(!pattern3.test(data0)){
validate243.errors = [{instancePath:instancePath+"/inviteToken",schemaPath:"#/properties/inviteToken/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z0-9_-]+$"},message:"must match pattern \""+"^[A-Za-z0-9_-]+$"+"\""}];
return false;
}
}
}
}
else {
validate243.errors = [{instancePath:instancePath+"/inviteToken",schemaPath:"#/properties/inviteToken/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
}
}
}
else {
validate243.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate243.errors = vErrors;
return errors === 0;
}
validate243.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpPreviewResult = validate244;
const schema82 = {"additionalProperties":false,"properties":{"moderated":{"default":false,"title":"Moderated","type":"boolean"},"roomId":{"format":"uuid","title":"Roomid","type":"string"},"title":{"title":"Title","type":"string"},"status":{"enum":["active","closed","expired"],"title":"Status","type":"string"},"participantCount":{"maximum":10,"minimum":0,"title":"Participantcount","type":"integer"},"capacity":{"maximum":10,"minimum":2,"title":"Capacity","type":"integer"},"expiresAt":{"maximum":9007199254740991,"minimum":0,"title":"Expiresat","type":"integer"}},"required":["roomId","title","status","participantCount","capacity","expiresAt"],"title":"PreviewResult","type":"object"};

function validate244(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate244.evaluated;
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
validate244.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((((key0 === "moderated") || (key0 === "roomId")) || (key0 === "title")) || (key0 === "status")) || (key0 === "participantCount")) || (key0 === "capacity")) || (key0 === "expiresAt"))){
validate244.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.moderated !== undefined){
const _errs2 = errors;
if(typeof data.moderated !== "boolean"){
validate244.errors = [{instancePath:instancePath+"/moderated",schemaPath:"#/properties/moderated/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.roomId !== undefined){
let data1 = data.roomId;
const _errs4 = errors;
if(errors === _errs4){
if(errors === _errs4){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate244.errors = [{instancePath:instancePath+"/roomId",schemaPath:"#/properties/roomId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate244.errors = [{instancePath:instancePath+"/roomId",schemaPath:"#/properties/roomId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
if(data.title !== undefined){
const _errs6 = errors;
if(typeof data.title !== "string"){
validate244.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
let data3 = data.status;
const _errs8 = errors;
if(typeof data3 !== "string"){
validate244.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data3 === "active") || (data3 === "closed")) || (data3 === "expired"))){
validate244.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema82.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.participantCount !== undefined){
let data4 = data.participantCount;
const _errs10 = errors;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
validate244.errors = [{instancePath:instancePath+"/participantCount",schemaPath:"#/properties/participantCount/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs10){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 10 || isNaN(data4)){
validate244.errors = [{instancePath:instancePath+"/participantCount",schemaPath:"#/properties/participantCount/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10},message:"must be <= 10"}];
return false;
}
else {
if(data4 < 0 || isNaN(data4)){
validate244.errors = [{instancePath:instancePath+"/participantCount",schemaPath:"#/properties/participantCount/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
if(data.capacity !== undefined){
let data5 = data.capacity;
const _errs12 = errors;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
validate244.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs12){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 10 || isNaN(data5)){
validate244.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10},message:"must be <= 10"}];
return false;
}
else {
if(data5 < 2 || isNaN(data5)){
validate244.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 2},message:"must be >= 2"}];
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
if(valid0){
if(data.expiresAt !== undefined){
let data6 = data.expiresAt;
const _errs14 = errors;
if(!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))){
validate244.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs14){
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 > 9007199254740991 || isNaN(data6)){
validate244.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data6 < 0 || isNaN(data6)){
validate244.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
return false;
}
}
}
}
var valid0 = _errs14 === errors;
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
else {
validate244.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate244.errors = vErrors;
return errors === 0;
}
validate244.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpJoinRoom = validate245;
const schema83 = {"additionalProperties":false,"properties":{"inviteToken":{"maxLength":43,"minLength":43,"pattern":"^[A-Za-z0-9_-]+$","title":"Invitetoken","type":"string"},"displayName":{"maxLength":32,"minLength":1,"title":"Displayname","type":"string"}},"required":["inviteToken","displayName"],"title":"JoinRoom","type":"object"};

function validate245(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate245.evaluated;
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
validate245.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "inviteToken") || (key0 === "displayName"))){
validate245.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate245.errors = [{instancePath:instancePath+"/inviteToken",schemaPath:"#/properties/inviteToken/maxLength",keyword:"maxLength",params:{limit: 43},message:"must NOT have more than 43 characters"}];
return false;
}
else {
if(func1(data0) < 43){
validate245.errors = [{instancePath:instancePath+"/inviteToken",schemaPath:"#/properties/inviteToken/minLength",keyword:"minLength",params:{limit: 43},message:"must NOT have fewer than 43 characters"}];
return false;
}
else {
if(!pattern3.test(data0)){
validate245.errors = [{instancePath:instancePath+"/inviteToken",schemaPath:"#/properties/inviteToken/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z0-9_-]+$"},message:"must match pattern \""+"^[A-Za-z0-9_-]+$"+"\""}];
return false;
}
}
}
}
else {
validate245.errors = [{instancePath:instancePath+"/inviteToken",schemaPath:"#/properties/inviteToken/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate245.errors = [{instancePath:instancePath+"/displayName",schemaPath:"#/properties/displayName/maxLength",keyword:"maxLength",params:{limit: 32},message:"must NOT have more than 32 characters"}];
return false;
}
else {
if(func1(data1) < 1){
validate245.errors = [{instancePath:instancePath+"/displayName",schemaPath:"#/properties/displayName/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate245.errors = [{instancePath:instancePath+"/displayName",schemaPath:"#/properties/displayName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate245.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate245.errors = vErrors;
return errors === 0;
}
validate245.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpJoinRoomResult = validate246;
const schema84 = {"additionalProperties":false,"properties":{"participantId":{"format":"uuid","title":"Participantid","type":"string"},"role":{"enum":["host","listener"],"title":"Role","type":"string"},"snapshot":{"$ref":"#/$defs/Snapshot"}},"required":["participantId","role","snapshot"],"title":"JoinRoomResult","type":"object"};

function validate246(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate246.evaluated;
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
validate246.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "participantId") || (key0 === "role")) || (key0 === "snapshot"))){
validate246.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate246.errors = [{instancePath:instancePath+"/participantId",schemaPath:"#/properties/participantId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate246.errors = [{instancePath:instancePath+"/participantId",schemaPath:"#/properties/participantId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate246.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((data1 === "host") || (data1 === "listener"))){
validate246.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/enum",keyword:"enum",params:{allowedValues: schema84.properties.role.enum},message:"must be equal to one of the allowed values"}];
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
if(!(validate163(data.snapshot, {instancePath:instancePath+"/snapshot",parentData:data,parentDataProperty:"snapshot",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate163.errors : vErrors.concat(validate163.errors);
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
validate246.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate246.errors = vErrors;
return errors === 0;
}
validate246.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpCloseRoom = validate248;
const schema85 = {"additionalProperties":false,"properties":{"expectedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Expectedplaybackrevision","type":"integer"}},"required":["expectedPlaybackRevision"],"title":"CloseRoom","type":"object"};

function validate248(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate248.evaluated;
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
validate248.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "expectedPlaybackRevision")){
validate248.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.expectedPlaybackRevision !== undefined){
let data0 = data.expectedPlaybackRevision;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate248.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs2){
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 > 9007199254740991 || isNaN(data0)){
validate248.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data0 < 0 || isNaN(data0)){
validate248.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate248.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate248.errors = vErrors;
return errors === 0;
}
validate248.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpSnapshot = validate249;

function validate249(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate249.evaluated;
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
validate249.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "room") || (key0 === "participants")) || (key0 === "playback")) || (key0 === "presenceSeq")) || (key0 === "playbackRevision")) || (key0 === "playlist"))){
validate249.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.room !== undefined){
const _errs2 = errors;
if(!(validate164(data.room, {instancePath:instancePath+"/room",parentData:data,parentDataProperty:"room",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate164.errors : vErrors.concat(validate164.errors);
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
if(!(validate166(data1[i0], {instancePath:instancePath+"/participants/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate166.errors : vErrors.concat(validate166.errors);
errors = vErrors.length;
}
var valid1 = _errs5 === errors;
if(!valid1){
break;
}
}
}
else {
validate249.errors = [{instancePath:instancePath+"/participants",schemaPath:"#/properties/participants/type",keyword:"type",params:{type: "array"},message:"must be array"}];
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
if(!(validate170(data.playback, {instancePath:instancePath+"/playback",parentData:data,parentDataProperty:"playback",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate170.errors : vErrors.concat(validate170.errors);
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
validate249.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs7){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate249.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 0 || isNaN(data4)){
validate249.errors = [{instancePath:instancePath+"/presenceSeq",schemaPath:"#/properties/presenceSeq/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate249.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs9){
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 9007199254740991 || isNaN(data5)){
validate249.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data5 < 0 || isNaN(data5)){
validate249.errors = [{instancePath:instancePath+"/playbackRevision",schemaPath:"#/properties/playbackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
if(valid0){
if(data.playlist !== undefined){
const _errs11 = errors;
if(!(validate174(data.playlist, {instancePath:instancePath+"/playlist",parentData:data,parentDataProperty:"playlist",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate174.errors : vErrors.concat(validate174.errors);
errors = vErrors.length;
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
}
}
else {
validate249.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate249.errors = vErrors;
return errors === 0;
}
validate249.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpInviteResult = validate254;
const schema86 = {"additionalProperties":false,"properties":{"inviteUrl":{"title":"Inviteurl","type":"string"},"expiresAt":{"maximum":9007199254740991,"minimum":0,"title":"Expiresat","type":"integer"}},"required":["inviteUrl","expiresAt"],"title":"InviteResult","type":"object"};

function validate254(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate254.evaluated;
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
validate254.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "inviteUrl") || (key0 === "expiresAt"))){
validate254.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.inviteUrl !== undefined){
const _errs2 = errors;
if(typeof data.inviteUrl !== "string"){
validate254.errors = [{instancePath:instancePath+"/inviteUrl",schemaPath:"#/properties/inviteUrl/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate254.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs4){
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 > 9007199254740991 || isNaN(data1)){
validate254.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data1 < 0 || isNaN(data1)){
validate254.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate254.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate254.errors = vErrors;
return errors === 0;
}
validate254.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpReserveUpload = validate255;
const schema87 = {"additionalProperties":false,"properties":{"fileName":{"maxLength":200,"minLength":1,"title":"Filename","type":"string"},"contentType":{"enum":["audio/mpeg","audio/wav","audio/x-wav","audio/mp4","audio/x-m4a"],"title":"Contenttype","type":"string"},"sizeBytes":{"exclusiveMinimum":0,"maximum":52428800,"title":"Sizebytes","type":"integer"}},"required":["fileName","contentType","sizeBytes"],"title":"ReserveUpload","type":"object"};

function validate255(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate255.evaluated;
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
validate255.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "fileName") || (key0 === "contentType")) || (key0 === "sizeBytes"))){
validate255.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate255.errors = [{instancePath:instancePath+"/fileName",schemaPath:"#/properties/fileName/maxLength",keyword:"maxLength",params:{limit: 200},message:"must NOT have more than 200 characters"}];
return false;
}
else {
if(func1(data0) < 1){
validate255.errors = [{instancePath:instancePath+"/fileName",schemaPath:"#/properties/fileName/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate255.errors = [{instancePath:instancePath+"/fileName",schemaPath:"#/properties/fileName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate255.errors = [{instancePath:instancePath+"/contentType",schemaPath:"#/properties/contentType/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((((data1 === "audio/mpeg") || (data1 === "audio/wav")) || (data1 === "audio/x-wav")) || (data1 === "audio/mp4")) || (data1 === "audio/x-m4a"))){
validate255.errors = [{instancePath:instancePath+"/contentType",schemaPath:"#/properties/contentType/enum",keyword:"enum",params:{allowedValues: schema87.properties.contentType.enum},message:"must be equal to one of the allowed values"}];
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
validate255.errors = [{instancePath:instancePath+"/sizeBytes",schemaPath:"#/properties/sizeBytes/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 52428800 || isNaN(data2)){
validate255.errors = [{instancePath:instancePath+"/sizeBytes",schemaPath:"#/properties/sizeBytes/maximum",keyword:"maximum",params:{comparison: "<=", limit: 52428800},message:"must be <= 52428800"}];
return false;
}
else {
if(data2 <= 0 || isNaN(data2)){
validate255.errors = [{instancePath:instancePath+"/sizeBytes",schemaPath:"#/properties/sizeBytes/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"}];
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
validate255.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate255.errors = vErrors;
return errors === 0;
}
validate255.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpReserveUploadResult = validate256;
const schema88 = {"additionalProperties":false,"properties":{"uploadId":{"format":"uuid","title":"Uploadid","type":"string"},"uploadUrl":{"title":"Uploadurl","type":"string"},"requiredHeaders":{"additionalProperties":{"type":"string"},"title":"Requiredheaders","type":"object"},"expiresAt":{"maximum":9007199254740991,"minimum":0,"title":"Expiresat","type":"integer"}},"required":["uploadId","uploadUrl","requiredHeaders","expiresAt"],"title":"ReserveUploadResult","type":"object"};

function validate256(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate256.evaluated;
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
validate256.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "uploadId") || (key0 === "uploadUrl")) || (key0 === "requiredHeaders")) || (key0 === "expiresAt"))){
validate256.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate256.errors = [{instancePath:instancePath+"/uploadId",schemaPath:"#/properties/uploadId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate256.errors = [{instancePath:instancePath+"/uploadId",schemaPath:"#/properties/uploadId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate256.errors = [{instancePath:instancePath+"/uploadUrl",schemaPath:"#/properties/uploadUrl/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate256.errors = [{instancePath:instancePath+"/requiredHeaders/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/requiredHeaders/additionalProperties/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid1 = _errs9 === errors;
if(!valid1){
break;
}
}
}
else {
validate256.errors = [{instancePath:instancePath+"/requiredHeaders",schemaPath:"#/properties/requiredHeaders/type",keyword:"type",params:{type: "object"},message:"must be object"}];
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
validate256.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs11){
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 9007199254740991 || isNaN(data4)){
validate256.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data4 < 0 || isNaN(data4)){
validate256.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate256.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate256.errors = vErrors;
return errors === 0;
}
validate256.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpCompleteUpload = validate257;
const schema89 = {"additionalProperties":false,"properties":{"checksum":{"anyOf":[{"pattern":"^[a-f0-9]{64}$","type":"string"},{"type":"null"}],"default":null,"title":"Checksum"}},"title":"CompleteUpload","type":"object"};
const pattern5 = new RegExp("^[a-f0-9]{64}$", "u");

function validate257(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate257.evaluated;
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
validate257.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate257.errors = vErrors;
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
validate257.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate257.errors = vErrors;
return errors === 0;
}
validate257.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpCompleteUploadResult = validate258;
const schema90 = {"additionalProperties":false,"properties":{"trackId":{"format":"uuid","title":"Trackid","type":"string"},"status":{"const":"processing","default":"processing","title":"Status","type":"string"}},"required":["trackId"],"title":"CompleteUploadResult","type":"object"};

function validate258(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate258.evaluated;
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
validate258.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "trackId") || (key0 === "status"))){
validate258.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate258.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate258.errors = [{instancePath:instancePath+"/trackId",schemaPath:"#/properties/trackId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate258.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if("processing" !== data1){
validate258.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/const",keyword:"const",params:{allowedValue: "processing"},message:"must be equal to constant"}];
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
validate258.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate258.errors = vErrors;
return errors === 0;
}
validate258.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpTrack = validate259;
const schema91 = {"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"title":{"title":"Title","type":"string"},"artist":{"title":"Artist","type":"string"},"durationMs":{"anyOf":[{"maximum":900000,"minimum":0,"type":"integer"},{"type":"null"}],"title":"Durationms"},"status":{"enum":["uploading","processing","ready","failed"],"title":"Status","type":"string"},"errorCode":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Errorcode"},"mediaVersion":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Mediaversion"},"coverUrl":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Coverurl"},"sourceUri":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Sourceuri"},"licenseId":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Licenseid"},"licenseUri":{"anyOf":[{"type":"string"},{"type":"null"}],"default":null,"title":"Licenseuri"}},"required":["id","title","artist","durationMs","status"],"title":"Track","type":"object"};

function validate259(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate259.evaluated;
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
validate259.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema91.properties, key0))){
validate259.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate259.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate259.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate259.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate259.errors = [{instancePath:instancePath+"/artist",schemaPath:"#/properties/artist/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate259.errors = vErrors;
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
validate259.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((((data4 === "uploading") || (data4 === "processing")) || (data4 === "ready")) || (data4 === "failed"))){
validate259.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema91.properties.status.enum},message:"must be equal to one of the allowed values"}];
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
validate259.errors = vErrors;
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
validate259.errors = vErrors;
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
validate259.errors = vErrors;
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
validate259.errors = vErrors;
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
validate259.errors = vErrors;
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
validate259.errors = vErrors;
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
validate259.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate259.errors = vErrors;
return errors === 0;
}
validate259.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpTrackList = validate260;
const schema92 = {"additionalProperties":false,"properties":{"items":{"items":{"$ref":"#/$defs/Track"},"title":"Items","type":"array"},"nextCursor":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"default":null,"title":"Nextcursor"}},"required":["items"],"title":"TrackList","type":"object"};

function validate200(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate200.evaluated;
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
validate200.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(func7.call(schema91.properties, key0))){
validate200.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate200.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate200.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate200.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate200.errors = [{instancePath:instancePath+"/artist",schemaPath:"#/properties/artist/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate200.errors = vErrors;
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
validate200.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((((data4 === "uploading") || (data4 === "processing")) || (data4 === "ready")) || (data4 === "failed"))){
validate200.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema91.properties.status.enum},message:"must be equal to one of the allowed values"}];
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
validate200.errors = vErrors;
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
validate200.errors = vErrors;
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
validate200.errors = vErrors;
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
validate200.errors = vErrors;
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
validate200.errors = vErrors;
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
validate200.errors = vErrors;
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
validate200.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate200.errors = vErrors;
return errors === 0;
}
validate200.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate260(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate260.evaluated;
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
validate260.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "items") || (key0 === "nextCursor"))){
validate260.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
if(!(validate200(data0[i0], {instancePath:instancePath+"/items/" + i0,parentData:data0,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate200.errors : vErrors.concat(validate200.errors);
errors = vErrors.length;
}
var valid1 = _errs4 === errors;
if(!valid1){
break;
}
}
}
else {
validate260.errors = [{instancePath:instancePath+"/items",schemaPath:"#/properties/items/type",keyword:"type",params:{type: "array"},message:"must be array"}];
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
validate260.errors = vErrors;
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
validate260.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate260.errors = vErrors;
return errors === 0;
}
validate260.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpPlaybackURL = validate262;
const schema93 = {"additionalProperties":false,"properties":{"url":{"title":"Url","type":"string"},"expiresAt":{"maximum":9007199254740991,"minimum":0,"title":"Expiresat","type":"integer"},"mediaVersion":{"title":"Mediaversion","type":"string"},"checksum":{"title":"Checksum","type":"string"},"contentType":{"title":"Contenttype","type":"string"}},"required":["url","expiresAt","mediaVersion","checksum","contentType"],"title":"PlaybackURL","type":"object"};

function validate262(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate262.evaluated;
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
validate262.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((((key0 === "url") || (key0 === "expiresAt")) || (key0 === "mediaVersion")) || (key0 === "checksum")) || (key0 === "contentType"))){
validate262.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.url !== undefined){
const _errs2 = errors;
if(typeof data.url !== "string"){
validate262.errors = [{instancePath:instancePath+"/url",schemaPath:"#/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate262.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs4){
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 > 9007199254740991 || isNaN(data1)){
validate262.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data1 < 0 || isNaN(data1)){
validate262.errors = [{instancePath:instancePath+"/expiresAt",schemaPath:"#/properties/expiresAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate262.errors = [{instancePath:instancePath+"/mediaVersion",schemaPath:"#/properties/mediaVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate262.errors = [{instancePath:instancePath+"/checksum",schemaPath:"#/properties/checksum/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate262.errors = [{instancePath:instancePath+"/contentType",schemaPath:"#/properties/contentType/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate262.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate262.errors = vErrors;
return errors === 0;
}
validate262.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpHTTPError = validate263;
const schema94 = {"additionalProperties":false,"properties":{"error":{"$ref":"#/$defs/ErrorBody"}},"required":["error"],"title":"HTTPError","type":"object"};
const schema95 = {"additionalProperties":false,"properties":{"code":{"title":"Code","type":"string"},"message":{"title":"Message","type":"string"},"requestId":{"format":"uuid","title":"Requestid","type":"string"},"details":{"anyOf":[{"items":{"$ref":"#/$defs/ValidationDetail"},"type":"array"},{"$ref":"#/$defs/ConflictDetail"},{"type":"null"}],"default":null,"title":"Details"}},"required":["code","message","requestId"],"title":"ErrorBody","type":"object"};
const schema96 = {"additionalProperties":false,"properties":{"field":{"title":"Field","type":"string"},"code":{"title":"Code","type":"string"}},"required":["field","code"],"title":"ValidationDetail","type":"object"};

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
if(((data.field === undefined) && (missing0 = "field")) || ((data.code === undefined) && (missing0 = "code"))){
validate209.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "field") || (key0 === "code"))){
validate209.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.field !== undefined){
const _errs2 = errors;
if(typeof data.field !== "string"){
validate209.errors = [{instancePath:instancePath+"/field",schemaPath:"#/properties/field/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate209.errors = [{instancePath:instancePath+"/code",schemaPath:"#/properties/code/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate209.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate209.errors = vErrors;
return errors === 0;
}
validate209.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema97 = {"additionalProperties":false,"properties":{"snapshot":{"$ref":"#/$defs/Snapshot"}},"required":["snapshot"],"title":"ConflictDetail","type":"object"};

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
if((data.snapshot === undefined) && (missing0 = "snapshot")){
validate211.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "snapshot")){
validate211.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.snapshot !== undefined){
if(!(validate163(data.snapshot, {instancePath:instancePath+"/snapshot",parentData:data,parentDataProperty:"snapshot",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate163.errors : vErrors.concat(validate163.errors);
errors = vErrors.length;
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
if((((data.code === undefined) && (missing0 = "code")) || ((data.message === undefined) && (missing0 = "message"))) || ((data.requestId === undefined) && (missing0 = "requestId"))){
validate208.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "code") || (key0 === "message")) || (key0 === "requestId")) || (key0 === "details"))){
validate208.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.code !== undefined){
const _errs2 = errors;
if(typeof data.code !== "string"){
validate208.errors = [{instancePath:instancePath+"/code",schemaPath:"#/properties/code/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate208.errors = [{instancePath:instancePath+"/message",schemaPath:"#/properties/message/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate208.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate208.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
if(!(validate209(data3[i0], {instancePath:instancePath+"/details/" + i0,parentData:data3,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate209.errors : vErrors.concat(validate209.errors);
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
if(!(validate211(data3, {instancePath:instancePath+"/details",parentData:data,parentDataProperty:"details",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate211.errors : vErrors.concat(validate211.errors);
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
validate208.errors = vErrors;
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
validate208.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate208.errors = vErrors;
return errors === 0;
}
validate208.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate263(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate263.evaluated;
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
validate263.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "error")){
validate263.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.error !== undefined){
if(!(validate208(data.error, {instancePath:instancePath+"/error",parentData:data,parentDataProperty:"error",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate208.errors : vErrors.concat(validate208.errors);
errors = vErrors.length;
}
}
}
}
}
else {
validate263.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate263.errors = vErrors;
return errors === 0;
}
validate263.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpRoomSettings = validate265;
const schema98 = {"additionalProperties":false,"properties":{"capacity":{"maximum":10,"minimum":2,"title":"Capacity","type":"integer"},"moderated":{"title":"Moderated","type":"boolean"}},"required":["capacity","moderated"],"title":"RoomSettings","type":"object"};

function validate265(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate265.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.capacity === undefined) && (missing0 = "capacity")) || ((data.moderated === undefined) && (missing0 = "moderated"))){
validate265.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "capacity") || (key0 === "moderated"))){
validate265.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.capacity !== undefined){
let data0 = data.capacity;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate265.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs2){
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 > 10 || isNaN(data0)){
validate265.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10},message:"must be <= 10"}];
return false;
}
else {
if(data0 < 2 || isNaN(data0)){
validate265.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 2},message:"must be >= 2"}];
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
if(data.moderated !== undefined){
const _errs4 = errors;
if(typeof data.moderated !== "boolean"){
validate265.errors = [{instancePath:instancePath+"/moderated",schemaPath:"#/properties/moderated/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
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
validate265.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate265.errors = vErrors;
return errors === 0;
}
validate265.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpEditorPermission = validate266;
const schema99 = {"additionalProperties":false,"properties":{"canEdit":{"title":"Canedit","type":"boolean"}},"required":["canEdit"],"title":"EditorPermission","type":"object"};

function validate266(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate266.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.canEdit === undefined) && (missing0 = "canEdit")){
validate266.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "canEdit")){
validate266.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.canEdit !== undefined){
if(typeof data.canEdit !== "boolean"){
validate266.errors = [{instancePath:instancePath+"/canEdit",schemaPath:"#/properties/canEdit/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
}
}
}
else {
validate266.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate266.errors = vErrors;
return errors === 0;
}
validate266.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpPlayerAction = validate267;
const schema100 = {"additionalProperties":false,"properties":{"expectedPlaybackRevision":{"maximum":9007199254740991,"minimum":0,"title":"Expectedplaybackrevision","type":"integer"},"action":{"enum":["next","previous","add","remove","move","options"],"title":"Action","type":"string"},"trackId":{"anyOf":[{"format":"uuid","type":"string"},{"type":"null"}],"default":null,"title":"Trackid"},"toIndex":{"anyOf":[{"maximum":99,"minimum":0,"type":"integer"},{"type":"null"}],"default":null,"title":"Toindex"},"repeat":{"anyOf":[{"enum":["off","all","one"],"type":"string"},{"type":"null"}],"default":null,"title":"Repeat"},"shuffle":{"anyOf":[{"type":"boolean"},{"type":"null"}],"default":null,"title":"Shuffle"}},"required":["expectedPlaybackRevision","action"],"title":"PlayerAction","type":"object"};

function validate267(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate267.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.expectedPlaybackRevision === undefined) && (missing0 = "expectedPlaybackRevision")) || ((data.action === undefined) && (missing0 = "action"))){
validate267.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((((key0 === "expectedPlaybackRevision") || (key0 === "action")) || (key0 === "trackId")) || (key0 === "toIndex")) || (key0 === "repeat")) || (key0 === "shuffle"))){
validate267.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.expectedPlaybackRevision !== undefined){
let data0 = data.expectedPlaybackRevision;
const _errs2 = errors;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
validate267.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs2){
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 > 9007199254740991 || isNaN(data0)){
validate267.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data0 < 0 || isNaN(data0)){
validate267.errors = [{instancePath:instancePath+"/expectedPlaybackRevision",schemaPath:"#/properties/expectedPlaybackRevision/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
if(data.action !== undefined){
let data1 = data.action;
const _errs4 = errors;
if(typeof data1 !== "string"){
validate267.errors = [{instancePath:instancePath+"/action",schemaPath:"#/properties/action/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((((((data1 === "next") || (data1 === "previous")) || (data1 === "add")) || (data1 === "remove")) || (data1 === "move")) || (data1 === "options"))){
validate267.errors = [{instancePath:instancePath+"/action",schemaPath:"#/properties/action/enum",keyword:"enum",params:{allowedValues: schema100.properties.action.enum},message:"must be equal to one of the allowed values"}];
return false;
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
validate267.errors = vErrors;
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
if(data.toIndex !== undefined){
let data3 = data.toIndex;
const _errs12 = errors;
const _errs13 = errors;
let valid2 = false;
const _errs14 = errors;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
const err4 = {instancePath:instancePath+"/toIndex",schemaPath:"#/properties/toIndex/anyOf/0/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(errors === _errs14){
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 99 || isNaN(data3)){
const err5 = {instancePath:instancePath+"/toIndex",schemaPath:"#/properties/toIndex/anyOf/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 99},message:"must be <= 99"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
else {
if(data3 < 0 || isNaN(data3)){
const err6 = {instancePath:instancePath+"/toIndex",schemaPath:"#/properties/toIndex/anyOf/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
}
}
var _valid1 = _errs14 === errors;
valid2 = valid2 || _valid1;
const _errs16 = errors;
if(data3 !== null){
const err7 = {instancePath:instancePath+"/toIndex",schemaPath:"#/properties/toIndex/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
var _valid1 = _errs16 === errors;
valid2 = valid2 || _valid1;
if(!valid2){
const err8 = {instancePath:instancePath+"/toIndex",schemaPath:"#/properties/toIndex/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
validate267.errors = vErrors;
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
if(data.repeat !== undefined){
let data4 = data.repeat;
const _errs18 = errors;
const _errs19 = errors;
let valid3 = false;
const _errs20 = errors;
if(typeof data4 !== "string"){
const err9 = {instancePath:instancePath+"/repeat",schemaPath:"#/properties/repeat/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(!(((data4 === "off") || (data4 === "all")) || (data4 === "one"))){
const err10 = {instancePath:instancePath+"/repeat",schemaPath:"#/properties/repeat/anyOf/0/enum",keyword:"enum",params:{allowedValues: schema100.properties.repeat.anyOf[0].enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
var _valid2 = _errs20 === errors;
valid3 = valid3 || _valid2;
const _errs22 = errors;
if(data4 !== null){
const err11 = {instancePath:instancePath+"/repeat",schemaPath:"#/properties/repeat/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
var _valid2 = _errs22 === errors;
valid3 = valid3 || _valid2;
if(!valid3){
const err12 = {instancePath:instancePath+"/repeat",schemaPath:"#/properties/repeat/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
validate267.errors = vErrors;
return false;
}
else {
errors = _errs19;
if(vErrors !== null){
if(_errs19){
vErrors.length = _errs19;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.shuffle !== undefined){
let data5 = data.shuffle;
const _errs24 = errors;
const _errs25 = errors;
let valid4 = false;
const _errs26 = errors;
if(typeof data5 !== "boolean"){
const err13 = {instancePath:instancePath+"/shuffle",schemaPath:"#/properties/shuffle/anyOf/0/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
var _valid3 = _errs26 === errors;
valid4 = valid4 || _valid3;
const _errs28 = errors;
if(data5 !== null){
const err14 = {instancePath:instancePath+"/shuffle",schemaPath:"#/properties/shuffle/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
var _valid3 = _errs28 === errors;
valid4 = valid4 || _valid3;
if(!valid4){
const err15 = {instancePath:instancePath+"/shuffle",schemaPath:"#/properties/shuffle/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
validate267.errors = vErrors;
return false;
}
else {
errors = _errs25;
if(vErrors !== null){
if(_errs25){
vErrors.length = _errs25;
}
else {
vErrors = null;
}
}
}
var valid0 = _errs24 === errors;
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
validate267.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate267.errors = vErrors;
return errors === 0;
}
validate267.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpAdmissionStatus = validate268;
const schema101 = {"additionalProperties":false,"properties":{"status":{"enum":["pending","approved","admitted","rejected","cancelled","expired","none"],"title":"Status","type":"string"}},"required":["status"],"title":"AdmissionStatus","type":"object"};

function validate268(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate268.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.status === undefined) && (missing0 = "status")){
validate268.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "status")){
validate268.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.status !== undefined){
let data0 = data.status;
if(typeof data0 !== "string"){
validate268.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((((((data0 === "pending") || (data0 === "approved")) || (data0 === "admitted")) || (data0 === "rejected")) || (data0 === "cancelled")) || (data0 === "expired")) || (data0 === "none"))){
validate268.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema101.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
}
}
}
}
else {
validate268.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate268.errors = vErrors;
return errors === 0;
}
validate268.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpEntryResult = validate269;
const schema102 = {"additionalProperties":false,"properties":{"status":{"enum":["pending","approved","admitted","rejected","cancelled","expired","none"],"title":"Status","type":"string"},"membership":{"anyOf":[{"$ref":"#/$defs/JoinRoomResult"},{"type":"null"}],"default":null}},"required":["status"],"title":"EntryResult","type":"object"};

function validate184(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate184.evaluated;
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
validate184.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "participantId") || (key0 === "role")) || (key0 === "snapshot"))){
validate184.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate184.errors = [{instancePath:instancePath+"/participantId",schemaPath:"#/properties/participantId/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate184.errors = [{instancePath:instancePath+"/participantId",schemaPath:"#/properties/participantId/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate184.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((data1 === "host") || (data1 === "listener"))){
validate184.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/enum",keyword:"enum",params:{allowedValues: schema84.properties.role.enum},message:"must be equal to one of the allowed values"}];
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
if(!(validate163(data.snapshot, {instancePath:instancePath+"/snapshot",parentData:data,parentDataProperty:"snapshot",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate163.errors : vErrors.concat(validate163.errors);
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
validate184.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate184.errors = vErrors;
return errors === 0;
}
validate184.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate269(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate269.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.status === undefined) && (missing0 = "status")){
validate269.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((key0 === "status") || (key0 === "membership"))){
validate269.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.status !== undefined){
let data0 = data.status;
const _errs2 = errors;
if(typeof data0 !== "string"){
validate269.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((((((data0 === "pending") || (data0 === "approved")) || (data0 === "admitted")) || (data0 === "rejected")) || (data0 === "cancelled")) || (data0 === "expired")) || (data0 === "none"))){
validate269.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema102.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.membership !== undefined){
let data1 = data.membership;
const _errs4 = errors;
const _errs5 = errors;
let valid1 = false;
const _errs6 = errors;
if(!(validate184(data1, {instancePath:instancePath+"/membership",parentData:data,parentDataProperty:"membership",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate184.errors : vErrors.concat(validate184.errors);
errors = vErrors.length;
}
var _valid0 = _errs6 === errors;
valid1 = valid1 || _valid0;
const _errs7 = errors;
if(data1 !== null){
const err0 = {instancePath:instancePath+"/membership",schemaPath:"#/properties/membership/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
var _valid0 = _errs7 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err1 = {instancePath:instancePath+"/membership",schemaPath:"#/properties/membership/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
validate269.errors = vErrors;
return false;
}
else {
errors = _errs5;
if(vErrors !== null){
if(_errs5){
vErrors.length = _errs5;
}
else {
vErrors = null;
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
validate269.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate269.errors = vErrors;
return errors === 0;
}
validate269.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpWaitingList = validate271;
const schema103 = {"additionalProperties":false,"properties":{"items":{"items":{"$ref":"#/$defs/WaitingGuest"},"title":"Items","type":"array"}},"required":["items"],"title":"WaitingList","type":"object"};
const schema104 = {"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"displayName":{"title":"Displayname","type":"string"},"requestedAt":{"maximum":9007199254740991,"minimum":0,"title":"Requestedat","type":"integer"}},"required":["id","displayName","requestedAt"],"title":"WaitingGuest","type":"object"};

function validate228(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate228.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.id === undefined) && (missing0 = "id")) || ((data.displayName === undefined) && (missing0 = "displayName"))) || ((data.requestedAt === undefined) && (missing0 = "requestedAt"))){
validate228.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(((key0 === "id") || (key0 === "displayName")) || (key0 === "requestedAt"))){
validate228.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate228.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate228.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate228.errors = [{instancePath:instancePath+"/displayName",schemaPath:"#/properties/displayName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.requestedAt !== undefined){
let data2 = data.requestedAt;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate228.errors = [{instancePath:instancePath+"/requestedAt",schemaPath:"#/properties/requestedAt/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 9007199254740991 || isNaN(data2)){
validate228.errors = [{instancePath:instancePath+"/requestedAt",schemaPath:"#/properties/requestedAt/maximum",keyword:"maximum",params:{comparison: "<=", limit: 9007199254740991},message:"must be <= 9007199254740991"}];
return false;
}
else {
if(data2 < 0 || isNaN(data2)){
validate228.errors = [{instancePath:instancePath+"/requestedAt",schemaPath:"#/properties/requestedAt/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];
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
validate228.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate228.errors = vErrors;
return errors === 0;
}
validate228.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate271(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate271.evaluated;
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
validate271.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "items")){
validate271.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
if(!(validate228(data0[i0], {instancePath:instancePath+"/items/" + i0,parentData:data0,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate228.errors : vErrors.concat(validate228.errors);
errors = vErrors.length;
}
var valid1 = _errs4 === errors;
if(!valid1){
break;
}
}
}
else {
validate271.errors = [{instancePath:instancePath+"/items",schemaPath:"#/properties/items/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
}
}
}
}
else {
validate271.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate271.errors = vErrors;
return errors === 0;
}
validate271.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpAdmissionDecision = validate273;
const schema105 = {"additionalProperties":false,"properties":{"admit":{"title":"Admit","type":"boolean"}},"required":["admit"],"title":"AdmissionDecision","type":"object"};

function validate273(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate273.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.admit === undefined) && (missing0 = "admit")){
validate273.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "admit")){
validate273.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.admit !== undefined){
if(typeof data.admit !== "boolean"){
validate273.errors = [{instancePath:instancePath+"/admit",schemaPath:"#/properties/admit/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
}
}
}
}
else {
validate273.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate273.errors = vErrors;
return errors === 0;
}
validate273.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpMyRooms = validate274;
const schema106 = {"additionalProperties":false,"properties":{"items":{"items":{"$ref":"#/$defs/MyRoom"},"title":"Items","type":"array"}},"required":["items"],"title":"MyRooms","type":"object"};
const schema107 = {"additionalProperties":false,"properties":{"id":{"format":"uuid","title":"Id","type":"string"},"title":{"title":"Title","type":"string"},"capacity":{"maximum":10,"minimum":2,"title":"Capacity","type":"integer"},"role":{"enum":["host","listener"],"title":"Role","type":"string"}},"required":["id","title","capacity","role"],"title":"MyRoom","type":"object"};

function validate234(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate234.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.id === undefined) && (missing0 = "id")) || ((data.title === undefined) && (missing0 = "title"))) || ((data.capacity === undefined) && (missing0 = "capacity"))) || ((data.role === undefined) && (missing0 = "role"))){
validate234.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "id") || (key0 === "title")) || (key0 === "capacity")) || (key0 === "role"))){
validate234.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
validate234.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate234.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
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
validate234.errors = [{instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.capacity !== undefined){
let data2 = data.capacity;
const _errs6 = errors;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
validate234.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 10 || isNaN(data2)){
validate234.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10},message:"must be <= 10"}];
return false;
}
else {
if(data2 < 2 || isNaN(data2)){
validate234.errors = [{instancePath:instancePath+"/capacity",schemaPath:"#/properties/capacity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 2},message:"must be >= 2"}];
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
if(data.role !== undefined){
let data3 = data.role;
const _errs8 = errors;
if(typeof data3 !== "string"){
validate234.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((data3 === "host") || (data3 === "listener"))){
validate234.errors = [{instancePath:instancePath+"/role",schemaPath:"#/properties/role/enum",keyword:"enum",params:{allowedValues: schema107.properties.role.enum},message:"must be equal to one of the allowed values"}];
return false;
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
validate234.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate234.errors = vErrors;
return errors === 0;
}
validate234.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate274(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate274.evaluated;
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
validate274.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "items")){
validate274.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
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
if(!(validate234(data0[i0], {instancePath:instancePath+"/items/" + i0,parentData:data0,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate234.errors : vErrors.concat(validate234.errors);
errors = vErrors.length;
}
var valid1 = _errs4 === errors;
if(!valid1){
break;
}
}
}
else {
validate274.errors = [{instancePath:instancePath+"/items",schemaPath:"#/properties/items/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
}
}
}
}
else {
validate274.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate274.errors = vErrors;
return errors === 0;
}
validate274.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

export const httpMemberAction = validate276;
const schema108 = {"additionalProperties":false,"properties":{"action":{"enum":["transfer","remove"],"title":"Action","type":"string"}},"required":["action"],"title":"MemberAction","type":"object"};

function validate276(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate276.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.action === undefined) && (missing0 = "action")){
validate276.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!(key0 === "action")){
validate276.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.action !== undefined){
let data0 = data.action;
if(typeof data0 !== "string"){
validate276.errors = [{instancePath:instancePath+"/action",schemaPath:"#/properties/action/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((data0 === "transfer") || (data0 === "remove"))){
validate276.errors = [{instancePath:instancePath+"/action",schemaPath:"#/properties/action/enum",keyword:"enum",params:{allowedValues: schema108.properties.action.enum},message:"must be equal to one of the allowed values"}];
return false;
}
}
}
}
}
else {
validate276.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate276.errors = vErrors;
return errors === 0;
}
validate276.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};
