/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const com = $root.com = (() => {

    /**
     * Namespace com.
     * @exports com
     * @namespace
     */
    const com = {};

    com.gomokumaster = (function() {

        /**
         * Namespace gomokumaster.
         * @memberof com
         * @namespace
         */
        const gomokumaster = {};

        gomokumaster.proto = (function() {

            /**
             * Namespace proto.
             * @memberof com.gomokumaster
             * @namespace
             */
            const proto = {};

            /**
             * MsgType enum.
             * @name com.gomokumaster.proto.MsgType
             * @enum {number}
             * @property {number} UNKNOWN=0 UNKNOWN value
             * @property {number} MATCH_REQ=1001 MATCH_REQ value
             * @property {number} MATCH_CANCEL=1002 MATCH_CANCEL value
             * @property {number} MATCH_RES=1003 MATCH_RES value
             * @property {number} MOVE_REQ=1004 MOVE_REQ value
             * @property {number} BOARD_UPDATE=1005 BOARD_UPDATE value
             * @property {number} GAME_OVER=1006 GAME_OVER value
             * @property {number} CHAT_REQ=1007 CHAT_REQ value
             * @property {number} CHAT_RES=1008 CHAT_RES value
             * @property {number} ERROR=1009 ERROR value
             * @property {number} SURRENDER=1011 SURRENDER value
             * @property {number} CONNECT=1012 CONNECT value
             * @property {number} GAME_RESUME=1013 GAME_RESUME value
             * @property {number} HEARTBEAT=1014 HEARTBEAT value
             * @property {number} GAME_DISCONNECT=1015 GAME_DISCONNECT value
             */
            proto.MsgType = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "UNKNOWN"] = 0;
                values[valuesById[1001] = "MATCH_REQ"] = 1001;
                values[valuesById[1002] = "MATCH_CANCEL"] = 1002;
                values[valuesById[1003] = "MATCH_RES"] = 1003;
                values[valuesById[1004] = "MOVE_REQ"] = 1004;
                values[valuesById[1005] = "BOARD_UPDATE"] = 1005;
                values[valuesById[1006] = "GAME_OVER"] = 1006;
                values[valuesById[1007] = "CHAT_REQ"] = 1007;
                values[valuesById[1008] = "CHAT_RES"] = 1008;
                values[valuesById[1009] = "ERROR"] = 1009;
                values[valuesById[1011] = "SURRENDER"] = 1011;
                values[valuesById[1012] = "CONNECT"] = 1012;
                values[valuesById[1013] = "GAME_RESUME"] = 1013;
                values[valuesById[1014] = "HEARTBEAT"] = 1014;
                values[valuesById[1015] = "GAME_DISCONNECT"] = 1015;
                return values;
            })();

            /**
             * PlayAction enum.
             * @name com.gomokumaster.proto.PlayAction
             * @enum {number}
             * @property {number} NONE=0 NONE value
             * @property {number} MOVE=1 MOVE value
             * @property {number} SKILL=2 SKILL value
             * @property {number} PLACE=3 PLACE value
             */
            proto.PlayAction = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "NONE"] = 0;
                values[valuesById[1] = "MOVE"] = 1;
                values[valuesById[2] = "SKILL"] = 2;
                values[valuesById[3] = "PLACE"] = 3;
                return values;
            })();

            proto.MoveReq = (function() {

                /**
                 * Properties of a MoveReq.
                 * @memberof com.gomokumaster.proto
                 * @interface IMoveReq
                 * @property {number|null} [x] MoveReq x
                 * @property {number|null} [y] MoveReq y
                 * @property {string|null} [pieceType] MoveReq pieceType
                 * @property {com.gomokumaster.proto.PlayAction|null} [type] MoveReq type
                 * @property {number|null} [targetX] MoveReq targetX
                 * @property {number|null} [targetY] MoveReq targetY
                 */

                /**
                 * Constructs a new MoveReq.
                 * @memberof com.gomokumaster.proto
                 * @classdesc Represents a MoveReq.
                 * @implements IMoveReq
                 * @constructor
                 * @param {com.gomokumaster.proto.IMoveReq=} [properties] Properties to set
                 */
                function MoveReq(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * MoveReq x.
                 * @member {number} x
                 * @memberof com.gomokumaster.proto.MoveReq
                 * @instance
                 */
                MoveReq.prototype.x = 0;

                /**
                 * MoveReq y.
                 * @member {number} y
                 * @memberof com.gomokumaster.proto.MoveReq
                 * @instance
                 */
                MoveReq.prototype.y = 0;

                /**
                 * MoveReq pieceType.
                 * @member {string} pieceType
                 * @memberof com.gomokumaster.proto.MoveReq
                 * @instance
                 */
                MoveReq.prototype.pieceType = "";

                /**
                 * MoveReq type.
                 * @member {com.gomokumaster.proto.PlayAction} type
                 * @memberof com.gomokumaster.proto.MoveReq
                 * @instance
                 */
                MoveReq.prototype.type = 0;

                /**
                 * MoveReq targetX.
                 * @member {number} targetX
                 * @memberof com.gomokumaster.proto.MoveReq
                 * @instance
                 */
                MoveReq.prototype.targetX = 0;

                /**
                 * MoveReq targetY.
                 * @member {number} targetY
                 * @memberof com.gomokumaster.proto.MoveReq
                 * @instance
                 */
                MoveReq.prototype.targetY = 0;

                /**
                 * Creates a new MoveReq instance using the specified properties.
                 * @function create
                 * @memberof com.gomokumaster.proto.MoveReq
                 * @static
                 * @param {com.gomokumaster.proto.IMoveReq=} [properties] Properties to set
                 * @returns {com.gomokumaster.proto.MoveReq} MoveReq instance
                 */
                MoveReq.create = function create(properties) {
                    return new MoveReq(properties);
                };

                /**
                 * Encodes the specified MoveReq message. Does not implicitly {@link com.gomokumaster.proto.MoveReq.verify|verify} messages.
                 * @function encode
                 * @memberof com.gomokumaster.proto.MoveReq
                 * @static
                 * @param {com.gomokumaster.proto.IMoveReq} message MoveReq message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                MoveReq.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.x);
                    if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.y);
                    if (message.pieceType != null && Object.hasOwnProperty.call(message, "pieceType"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.pieceType);
                    if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.type);
                    if (message.targetX != null && Object.hasOwnProperty.call(message, "targetX"))
                        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.targetX);
                    if (message.targetY != null && Object.hasOwnProperty.call(message, "targetY"))
                        writer.uint32(/* id 6, wireType 0 =*/48).int32(message.targetY);
                    return writer;
                };

                /**
                 * Encodes the specified MoveReq message, length delimited. Does not implicitly {@link com.gomokumaster.proto.MoveReq.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof com.gomokumaster.proto.MoveReq
                 * @static
                 * @param {com.gomokumaster.proto.IMoveReq} message MoveReq message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                MoveReq.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a MoveReq message from the specified reader or buffer.
                 * @function decode
                 * @memberof com.gomokumaster.proto.MoveReq
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {com.gomokumaster.proto.MoveReq} MoveReq
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                MoveReq.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.gomokumaster.proto.MoveReq();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.x = reader.int32();
                                break;
                            }
                        case 2: {
                                message.y = reader.int32();
                                break;
                            }
                        case 3: {
                                message.pieceType = reader.string();
                                break;
                            }
                        case 4: {
                                message.type = reader.int32();
                                break;
                            }
                        case 5: {
                                message.targetX = reader.int32();
                                break;
                            }
                        case 6: {
                                message.targetY = reader.int32();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a MoveReq message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof com.gomokumaster.proto.MoveReq
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {com.gomokumaster.proto.MoveReq} MoveReq
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                MoveReq.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a MoveReq message.
                 * @function verify
                 * @memberof com.gomokumaster.proto.MoveReq
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                MoveReq.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.x != null && message.hasOwnProperty("x"))
                        if (!$util.isInteger(message.x))
                            return "x: integer expected";
                    if (message.y != null && message.hasOwnProperty("y"))
                        if (!$util.isInteger(message.y))
                            return "y: integer expected";
                    if (message.pieceType != null && message.hasOwnProperty("pieceType"))
                        if (!$util.isString(message.pieceType))
                            return "pieceType: string expected";
                    if (message.type != null && message.hasOwnProperty("type"))
                        switch (message.type) {
                        default:
                            return "type: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            break;
                        }
                    if (message.targetX != null && message.hasOwnProperty("targetX"))
                        if (!$util.isInteger(message.targetX))
                            return "targetX: integer expected";
                    if (message.targetY != null && message.hasOwnProperty("targetY"))
                        if (!$util.isInteger(message.targetY))
                            return "targetY: integer expected";
                    return null;
                };

                /**
                 * Creates a MoveReq message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof com.gomokumaster.proto.MoveReq
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {com.gomokumaster.proto.MoveReq} MoveReq
                 */
                MoveReq.fromObject = function fromObject(object) {
                    if (object instanceof $root.com.gomokumaster.proto.MoveReq)
                        return object;
                    let message = new $root.com.gomokumaster.proto.MoveReq();
                    if (object.x != null)
                        message.x = object.x | 0;
                    if (object.y != null)
                        message.y = object.y | 0;
                    if (object.pieceType != null)
                        message.pieceType = String(object.pieceType);
                    switch (object.type) {
                    default:
                        if (typeof object.type === "number") {
                            message.type = object.type;
                            break;
                        }
                        break;
                    case "NONE":
                    case 0:
                        message.type = 0;
                        break;
                    case "MOVE":
                    case 1:
                        message.type = 1;
                        break;
                    case "SKILL":
                    case 2:
                        message.type = 2;
                        break;
                    case "PLACE":
                    case 3:
                        message.type = 3;
                        break;
                    }
                    if (object.targetX != null)
                        message.targetX = object.targetX | 0;
                    if (object.targetY != null)
                        message.targetY = object.targetY | 0;
                    return message;
                };

                /**
                 * Creates a plain object from a MoveReq message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof com.gomokumaster.proto.MoveReq
                 * @static
                 * @param {com.gomokumaster.proto.MoveReq} message MoveReq
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                MoveReq.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        object.x = 0;
                        object.y = 0;
                        object.pieceType = "";
                        object.type = options.enums === String ? "NONE" : 0;
                        object.targetX = 0;
                        object.targetY = 0;
                    }
                    if (message.x != null && message.hasOwnProperty("x"))
                        object.x = message.x;
                    if (message.y != null && message.hasOwnProperty("y"))
                        object.y = message.y;
                    if (message.pieceType != null && message.hasOwnProperty("pieceType"))
                        object.pieceType = message.pieceType;
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = options.enums === String ? $root.com.gomokumaster.proto.PlayAction[message.type] === undefined ? message.type : $root.com.gomokumaster.proto.PlayAction[message.type] : message.type;
                    if (message.targetX != null && message.hasOwnProperty("targetX"))
                        object.targetX = message.targetX;
                    if (message.targetY != null && message.hasOwnProperty("targetY"))
                        object.targetY = message.targetY;
                    return object;
                };

                /**
                 * Converts this MoveReq to JSON.
                 * @function toJSON
                 * @memberof com.gomokumaster.proto.MoveReq
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                MoveReq.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for MoveReq
                 * @function getTypeUrl
                 * @memberof com.gomokumaster.proto.MoveReq
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                MoveReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/com.gomokumaster.proto.MoveReq";
                };

                return MoveReq;
            })();

            /**
             * PieceType enum.
             * @name com.gomokumaster.proto.PieceType
             * @enum {number}
             * @property {number} EMPTY=0 EMPTY value
             * @property {number} NORMAL=1 NORMAL value
             * @property {number} ARCHER=2 ARCHER value
             * @property {number} CAVALRY=3 CAVALRY value
             * @property {number} SHIELD=4 SHIELD value
             */
            proto.PieceType = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "EMPTY"] = 0;
                values[valuesById[1] = "NORMAL"] = 1;
                values[valuesById[2] = "ARCHER"] = 2;
                values[valuesById[3] = "CAVALRY"] = 3;
                values[valuesById[4] = "SHIELD"] = 4;
                return values;
            })();

            /**
             * GameStatus enum.
             * @name com.gomokumaster.proto.GameStatus
             * @enum {number}
             * @property {number} WAITING=0 WAITING value
             * @property {number} STARTED=1 STARTED value
             * @property {number} FINISHED=2 FINISHED value
             * @property {number} PAUSED=3 PAUSED value
             */
            proto.GameStatus = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "WAITING"] = 0;
                values[valuesById[1] = "STARTED"] = 1;
                values[valuesById[2] = "FINISHED"] = 2;
                values[valuesById[3] = "PAUSED"] = 3;
                return values;
            })();

            proto.Piece = (function() {

                /**
                 * Properties of a Piece.
                 * @memberof com.gomokumaster.proto
                 * @interface IPiece
                 * @property {string|null} [id] Piece id
                 * @property {number|null} [x] Piece x
                 * @property {number|null} [y] Piece y
                 * @property {string|null} [ownerId] Piece ownerId
                 * @property {com.gomokumaster.proto.PieceType|null} [pieceType] Piece pieceType
                 * @property {number|null} [maxCd] Piece maxCd
                 * @property {number|null} [color] Piece color
                 * @property {boolean|null} [isAlive] Piece isAlive
                 * @property {number|null} [skillCd] Piece skillCd
                 */

                /**
                 * Constructs a new Piece.
                 * @memberof com.gomokumaster.proto
                 * @classdesc Represents a Piece.
                 * @implements IPiece
                 * @constructor
                 * @param {com.gomokumaster.proto.IPiece=} [properties] Properties to set
                 */
                function Piece(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Piece id.
                 * @member {string} id
                 * @memberof com.gomokumaster.proto.Piece
                 * @instance
                 */
                Piece.prototype.id = "";

                /**
                 * Piece x.
                 * @member {number} x
                 * @memberof com.gomokumaster.proto.Piece
                 * @instance
                 */
                Piece.prototype.x = 0;

                /**
                 * Piece y.
                 * @member {number} y
                 * @memberof com.gomokumaster.proto.Piece
                 * @instance
                 */
                Piece.prototype.y = 0;

                /**
                 * Piece ownerId.
                 * @member {string} ownerId
                 * @memberof com.gomokumaster.proto.Piece
                 * @instance
                 */
                Piece.prototype.ownerId = "";

                /**
                 * Piece pieceType.
                 * @member {com.gomokumaster.proto.PieceType} pieceType
                 * @memberof com.gomokumaster.proto.Piece
                 * @instance
                 */
                Piece.prototype.pieceType = 0;

                /**
                 * Piece maxCd.
                 * @member {number} maxCd
                 * @memberof com.gomokumaster.proto.Piece
                 * @instance
                 */
                Piece.prototype.maxCd = 0;

                /**
                 * Piece color.
                 * @member {number} color
                 * @memberof com.gomokumaster.proto.Piece
                 * @instance
                 */
                Piece.prototype.color = 0;

                /**
                 * Piece isAlive.
                 * @member {boolean} isAlive
                 * @memberof com.gomokumaster.proto.Piece
                 * @instance
                 */
                Piece.prototype.isAlive = false;

                /**
                 * Piece skillCd.
                 * @member {number} skillCd
                 * @memberof com.gomokumaster.proto.Piece
                 * @instance
                 */
                Piece.prototype.skillCd = 0;

                /**
                 * Creates a new Piece instance using the specified properties.
                 * @function create
                 * @memberof com.gomokumaster.proto.Piece
                 * @static
                 * @param {com.gomokumaster.proto.IPiece=} [properties] Properties to set
                 * @returns {com.gomokumaster.proto.Piece} Piece instance
                 */
                Piece.create = function create(properties) {
                    return new Piece(properties);
                };

                /**
                 * Encodes the specified Piece message. Does not implicitly {@link com.gomokumaster.proto.Piece.verify|verify} messages.
                 * @function encode
                 * @memberof com.gomokumaster.proto.Piece
                 * @static
                 * @param {com.gomokumaster.proto.IPiece} message Piece message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Piece.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                    if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.x);
                    if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.y);
                    if (message.ownerId != null && Object.hasOwnProperty.call(message, "ownerId"))
                        writer.uint32(/* id 5, wireType 2 =*/42).string(message.ownerId);
                    if (message.pieceType != null && Object.hasOwnProperty.call(message, "pieceType"))
                        writer.uint32(/* id 6, wireType 0 =*/48).int32(message.pieceType);
                    if (message.maxCd != null && Object.hasOwnProperty.call(message, "maxCd"))
                        writer.uint32(/* id 7, wireType 0 =*/56).int32(message.maxCd);
                    if (message.color != null && Object.hasOwnProperty.call(message, "color"))
                        writer.uint32(/* id 8, wireType 0 =*/64).int32(message.color);
                    if (message.isAlive != null && Object.hasOwnProperty.call(message, "isAlive"))
                        writer.uint32(/* id 9, wireType 0 =*/72).bool(message.isAlive);
                    if (message.skillCd != null && Object.hasOwnProperty.call(message, "skillCd"))
                        writer.uint32(/* id 11, wireType 0 =*/88).int32(message.skillCd);
                    return writer;
                };

                /**
                 * Encodes the specified Piece message, length delimited. Does not implicitly {@link com.gomokumaster.proto.Piece.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof com.gomokumaster.proto.Piece
                 * @static
                 * @param {com.gomokumaster.proto.IPiece} message Piece message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Piece.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Piece message from the specified reader or buffer.
                 * @function decode
                 * @memberof com.gomokumaster.proto.Piece
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {com.gomokumaster.proto.Piece} Piece
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Piece.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.gomokumaster.proto.Piece();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.id = reader.string();
                                break;
                            }
                        case 2: {
                                message.x = reader.int32();
                                break;
                            }
                        case 3: {
                                message.y = reader.int32();
                                break;
                            }
                        case 5: {
                                message.ownerId = reader.string();
                                break;
                            }
                        case 6: {
                                message.pieceType = reader.int32();
                                break;
                            }
                        case 7: {
                                message.maxCd = reader.int32();
                                break;
                            }
                        case 8: {
                                message.color = reader.int32();
                                break;
                            }
                        case 9: {
                                message.isAlive = reader.bool();
                                break;
                            }
                        case 11: {
                                message.skillCd = reader.int32();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Piece message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof com.gomokumaster.proto.Piece
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {com.gomokumaster.proto.Piece} Piece
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Piece.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Piece message.
                 * @function verify
                 * @memberof com.gomokumaster.proto.Piece
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Piece.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isString(message.id))
                            return "id: string expected";
                    if (message.x != null && message.hasOwnProperty("x"))
                        if (!$util.isInteger(message.x))
                            return "x: integer expected";
                    if (message.y != null && message.hasOwnProperty("y"))
                        if (!$util.isInteger(message.y))
                            return "y: integer expected";
                    if (message.ownerId != null && message.hasOwnProperty("ownerId"))
                        if (!$util.isString(message.ownerId))
                            return "ownerId: string expected";
                    if (message.pieceType != null && message.hasOwnProperty("pieceType"))
                        switch (message.pieceType) {
                        default:
                            return "pieceType: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                            break;
                        }
                    if (message.maxCd != null && message.hasOwnProperty("maxCd"))
                        if (!$util.isInteger(message.maxCd))
                            return "maxCd: integer expected";
                    if (message.color != null && message.hasOwnProperty("color"))
                        if (!$util.isInteger(message.color))
                            return "color: integer expected";
                    if (message.isAlive != null && message.hasOwnProperty("isAlive"))
                        if (typeof message.isAlive !== "boolean")
                            return "isAlive: boolean expected";
                    if (message.skillCd != null && message.hasOwnProperty("skillCd"))
                        if (!$util.isInteger(message.skillCd))
                            return "skillCd: integer expected";
                    return null;
                };

                /**
                 * Creates a Piece message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof com.gomokumaster.proto.Piece
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {com.gomokumaster.proto.Piece} Piece
                 */
                Piece.fromObject = function fromObject(object) {
                    if (object instanceof $root.com.gomokumaster.proto.Piece)
                        return object;
                    let message = new $root.com.gomokumaster.proto.Piece();
                    if (object.id != null)
                        message.id = String(object.id);
                    if (object.x != null)
                        message.x = object.x | 0;
                    if (object.y != null)
                        message.y = object.y | 0;
                    if (object.ownerId != null)
                        message.ownerId = String(object.ownerId);
                    switch (object.pieceType) {
                    default:
                        if (typeof object.pieceType === "number") {
                            message.pieceType = object.pieceType;
                            break;
                        }
                        break;
                    case "EMPTY":
                    case 0:
                        message.pieceType = 0;
                        break;
                    case "NORMAL":
                    case 1:
                        message.pieceType = 1;
                        break;
                    case "ARCHER":
                    case 2:
                        message.pieceType = 2;
                        break;
                    case "CAVALRY":
                    case 3:
                        message.pieceType = 3;
                        break;
                    case "SHIELD":
                    case 4:
                        message.pieceType = 4;
                        break;
                    }
                    if (object.maxCd != null)
                        message.maxCd = object.maxCd | 0;
                    if (object.color != null)
                        message.color = object.color | 0;
                    if (object.isAlive != null)
                        message.isAlive = Boolean(object.isAlive);
                    if (object.skillCd != null)
                        message.skillCd = object.skillCd | 0;
                    return message;
                };

                /**
                 * Creates a plain object from a Piece message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof com.gomokumaster.proto.Piece
                 * @static
                 * @param {com.gomokumaster.proto.Piece} message Piece
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Piece.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        object.id = "";
                        object.x = 0;
                        object.y = 0;
                        object.ownerId = "";
                        object.pieceType = options.enums === String ? "EMPTY" : 0;
                        object.maxCd = 0;
                        object.color = 0;
                        object.isAlive = false;
                        object.skillCd = 0;
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.x != null && message.hasOwnProperty("x"))
                        object.x = message.x;
                    if (message.y != null && message.hasOwnProperty("y"))
                        object.y = message.y;
                    if (message.ownerId != null && message.hasOwnProperty("ownerId"))
                        object.ownerId = message.ownerId;
                    if (message.pieceType != null && message.hasOwnProperty("pieceType"))
                        object.pieceType = options.enums === String ? $root.com.gomokumaster.proto.PieceType[message.pieceType] === undefined ? message.pieceType : $root.com.gomokumaster.proto.PieceType[message.pieceType] : message.pieceType;
                    if (message.maxCd != null && message.hasOwnProperty("maxCd"))
                        object.maxCd = message.maxCd;
                    if (message.color != null && message.hasOwnProperty("color"))
                        object.color = message.color;
                    if (message.isAlive != null && message.hasOwnProperty("isAlive"))
                        object.isAlive = message.isAlive;
                    if (message.skillCd != null && message.hasOwnProperty("skillCd"))
                        object.skillCd = message.skillCd;
                    return object;
                };

                /**
                 * Converts this Piece to JSON.
                 * @function toJSON
                 * @memberof com.gomokumaster.proto.Piece
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Piece.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Piece
                 * @function getTypeUrl
                 * @memberof com.gomokumaster.proto.Piece
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Piece.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/com.gomokumaster.proto.Piece";
                };

                return Piece;
            })();

            proto.Player = (function() {

                /**
                 * Properties of a Player.
                 * @memberof com.gomokumaster.proto
                 * @interface IPlayer
                 * @property {string|null} [id] Player id
                 * @property {string|null} [name] Player name
                 * @property {string|null} [avatar] Player avatar
                 * @property {number|null} [color] Player color
                 * @property {number|null} [remainingShieldCount] Player remainingShieldCount
                 * @property {number|null} [remainingArcherCount] Player remainingArcherCount
                 * @property {number|null} [remainingCavalryCount] Player remainingCavalryCount
                 * @property {boolean|null} [isConnected] Player isConnected
                 */

                /**
                 * Constructs a new Player.
                 * @memberof com.gomokumaster.proto
                 * @classdesc Represents a Player.
                 * @implements IPlayer
                 * @constructor
                 * @param {com.gomokumaster.proto.IPlayer=} [properties] Properties to set
                 */
                function Player(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Player id.
                 * @member {string} id
                 * @memberof com.gomokumaster.proto.Player
                 * @instance
                 */
                Player.prototype.id = "";

                /**
                 * Player name.
                 * @member {string} name
                 * @memberof com.gomokumaster.proto.Player
                 * @instance
                 */
                Player.prototype.name = "";

                /**
                 * Player avatar.
                 * @member {string} avatar
                 * @memberof com.gomokumaster.proto.Player
                 * @instance
                 */
                Player.prototype.avatar = "";

                /**
                 * Player color.
                 * @member {number} color
                 * @memberof com.gomokumaster.proto.Player
                 * @instance
                 */
                Player.prototype.color = 0;

                /**
                 * Player remainingShieldCount.
                 * @member {number} remainingShieldCount
                 * @memberof com.gomokumaster.proto.Player
                 * @instance
                 */
                Player.prototype.remainingShieldCount = 0;

                /**
                 * Player remainingArcherCount.
                 * @member {number} remainingArcherCount
                 * @memberof com.gomokumaster.proto.Player
                 * @instance
                 */
                Player.prototype.remainingArcherCount = 0;

                /**
                 * Player remainingCavalryCount.
                 * @member {number} remainingCavalryCount
                 * @memberof com.gomokumaster.proto.Player
                 * @instance
                 */
                Player.prototype.remainingCavalryCount = 0;

                /**
                 * Player isConnected.
                 * @member {boolean} isConnected
                 * @memberof com.gomokumaster.proto.Player
                 * @instance
                 */
                Player.prototype.isConnected = false;

                /**
                 * Creates a new Player instance using the specified properties.
                 * @function create
                 * @memberof com.gomokumaster.proto.Player
                 * @static
                 * @param {com.gomokumaster.proto.IPlayer=} [properties] Properties to set
                 * @returns {com.gomokumaster.proto.Player} Player instance
                 */
                Player.create = function create(properties) {
                    return new Player(properties);
                };

                /**
                 * Encodes the specified Player message. Does not implicitly {@link com.gomokumaster.proto.Player.verify|verify} messages.
                 * @function encode
                 * @memberof com.gomokumaster.proto.Player
                 * @static
                 * @param {com.gomokumaster.proto.IPlayer} message Player message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Player.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                    if (message.avatar != null && Object.hasOwnProperty.call(message, "avatar"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.avatar);
                    if (message.color != null && Object.hasOwnProperty.call(message, "color"))
                        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.color);
                    if (message.remainingShieldCount != null && Object.hasOwnProperty.call(message, "remainingShieldCount"))
                        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.remainingShieldCount);
                    if (message.remainingArcherCount != null && Object.hasOwnProperty.call(message, "remainingArcherCount"))
                        writer.uint32(/* id 6, wireType 0 =*/48).int32(message.remainingArcherCount);
                    if (message.remainingCavalryCount != null && Object.hasOwnProperty.call(message, "remainingCavalryCount"))
                        writer.uint32(/* id 7, wireType 0 =*/56).int32(message.remainingCavalryCount);
                    if (message.isConnected != null && Object.hasOwnProperty.call(message, "isConnected"))
                        writer.uint32(/* id 8, wireType 0 =*/64).bool(message.isConnected);
                    return writer;
                };

                /**
                 * Encodes the specified Player message, length delimited. Does not implicitly {@link com.gomokumaster.proto.Player.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof com.gomokumaster.proto.Player
                 * @static
                 * @param {com.gomokumaster.proto.IPlayer} message Player message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Player.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Player message from the specified reader or buffer.
                 * @function decode
                 * @memberof com.gomokumaster.proto.Player
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {com.gomokumaster.proto.Player} Player
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Player.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.gomokumaster.proto.Player();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.id = reader.string();
                                break;
                            }
                        case 2: {
                                message.name = reader.string();
                                break;
                            }
                        case 3: {
                                message.avatar = reader.string();
                                break;
                            }
                        case 4: {
                                message.color = reader.int32();
                                break;
                            }
                        case 5: {
                                message.remainingShieldCount = reader.int32();
                                break;
                            }
                        case 6: {
                                message.remainingArcherCount = reader.int32();
                                break;
                            }
                        case 7: {
                                message.remainingCavalryCount = reader.int32();
                                break;
                            }
                        case 8: {
                                message.isConnected = reader.bool();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Player message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof com.gomokumaster.proto.Player
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {com.gomokumaster.proto.Player} Player
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Player.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Player message.
                 * @function verify
                 * @memberof com.gomokumaster.proto.Player
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Player.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isString(message.id))
                            return "id: string expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.avatar != null && message.hasOwnProperty("avatar"))
                        if (!$util.isString(message.avatar))
                            return "avatar: string expected";
                    if (message.color != null && message.hasOwnProperty("color"))
                        if (!$util.isInteger(message.color))
                            return "color: integer expected";
                    if (message.remainingShieldCount != null && message.hasOwnProperty("remainingShieldCount"))
                        if (!$util.isInteger(message.remainingShieldCount))
                            return "remainingShieldCount: integer expected";
                    if (message.remainingArcherCount != null && message.hasOwnProperty("remainingArcherCount"))
                        if (!$util.isInteger(message.remainingArcherCount))
                            return "remainingArcherCount: integer expected";
                    if (message.remainingCavalryCount != null && message.hasOwnProperty("remainingCavalryCount"))
                        if (!$util.isInteger(message.remainingCavalryCount))
                            return "remainingCavalryCount: integer expected";
                    if (message.isConnected != null && message.hasOwnProperty("isConnected"))
                        if (typeof message.isConnected !== "boolean")
                            return "isConnected: boolean expected";
                    return null;
                };

                /**
                 * Creates a Player message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof com.gomokumaster.proto.Player
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {com.gomokumaster.proto.Player} Player
                 */
                Player.fromObject = function fromObject(object) {
                    if (object instanceof $root.com.gomokumaster.proto.Player)
                        return object;
                    let message = new $root.com.gomokumaster.proto.Player();
                    if (object.id != null)
                        message.id = String(object.id);
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.avatar != null)
                        message.avatar = String(object.avatar);
                    if (object.color != null)
                        message.color = object.color | 0;
                    if (object.remainingShieldCount != null)
                        message.remainingShieldCount = object.remainingShieldCount | 0;
                    if (object.remainingArcherCount != null)
                        message.remainingArcherCount = object.remainingArcherCount | 0;
                    if (object.remainingCavalryCount != null)
                        message.remainingCavalryCount = object.remainingCavalryCount | 0;
                    if (object.isConnected != null)
                        message.isConnected = Boolean(object.isConnected);
                    return message;
                };

                /**
                 * Creates a plain object from a Player message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof com.gomokumaster.proto.Player
                 * @static
                 * @param {com.gomokumaster.proto.Player} message Player
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Player.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        object.id = "";
                        object.name = "";
                        object.avatar = "";
                        object.color = 0;
                        object.remainingShieldCount = 0;
                        object.remainingArcherCount = 0;
                        object.remainingCavalryCount = 0;
                        object.isConnected = false;
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.avatar != null && message.hasOwnProperty("avatar"))
                        object.avatar = message.avatar;
                    if (message.color != null && message.hasOwnProperty("color"))
                        object.color = message.color;
                    if (message.remainingShieldCount != null && message.hasOwnProperty("remainingShieldCount"))
                        object.remainingShieldCount = message.remainingShieldCount;
                    if (message.remainingArcherCount != null && message.hasOwnProperty("remainingArcherCount"))
                        object.remainingArcherCount = message.remainingArcherCount;
                    if (message.remainingCavalryCount != null && message.hasOwnProperty("remainingCavalryCount"))
                        object.remainingCavalryCount = message.remainingCavalryCount;
                    if (message.isConnected != null && message.hasOwnProperty("isConnected"))
                        object.isConnected = message.isConnected;
                    return object;
                };

                /**
                 * Converts this Player to JSON.
                 * @function toJSON
                 * @memberof com.gomokumaster.proto.Player
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Player.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Player
                 * @function getTypeUrl
                 * @memberof com.gomokumaster.proto.Player
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Player.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/com.gomokumaster.proto.Player";
                };

                return Player;
            })();

            proto.GameSnapshot = (function() {

                /**
                 * Properties of a GameSnapshot.
                 * @memberof com.gomokumaster.proto
                 * @interface IGameSnapshot
                 * @property {string|null} [roomId] GameSnapshot roomId
                 * @property {Array.<com.gomokumaster.proto.IBoardRow>|null} [board] GameSnapshot board
                 * @property {com.gomokumaster.proto.IPlayer|null} [yourInfo] GameSnapshot yourInfo
                 * @property {com.gomokumaster.proto.IPlayer|null} [opponent] GameSnapshot opponent
                 * @property {number|null} [currentTurnId] GameSnapshot currentTurnId
                 * @property {com.gomokumaster.proto.GameStatus|null} [status] GameSnapshot status
                 * @property {string|null} [yourColor] GameSnapshot yourColor
                 * @property {string|null} [lastAction] GameSnapshot lastAction
                 */

                /**
                 * Constructs a new GameSnapshot.
                 * @memberof com.gomokumaster.proto
                 * @classdesc Represents a GameSnapshot.
                 * @implements IGameSnapshot
                 * @constructor
                 * @param {com.gomokumaster.proto.IGameSnapshot=} [properties] Properties to set
                 */
                function GameSnapshot(properties) {
                    this.board = [];
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * GameSnapshot roomId.
                 * @member {string} roomId
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @instance
                 */
                GameSnapshot.prototype.roomId = "";

                /**
                 * GameSnapshot board.
                 * @member {Array.<com.gomokumaster.proto.IBoardRow>} board
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @instance
                 */
                GameSnapshot.prototype.board = $util.emptyArray;

                /**
                 * GameSnapshot yourInfo.
                 * @member {com.gomokumaster.proto.IPlayer|null|undefined} yourInfo
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @instance
                 */
                GameSnapshot.prototype.yourInfo = null;

                /**
                 * GameSnapshot opponent.
                 * @member {com.gomokumaster.proto.IPlayer|null|undefined} opponent
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @instance
                 */
                GameSnapshot.prototype.opponent = null;

                /**
                 * GameSnapshot currentTurnId.
                 * @member {number} currentTurnId
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @instance
                 */
                GameSnapshot.prototype.currentTurnId = 0;

                /**
                 * GameSnapshot status.
                 * @member {com.gomokumaster.proto.GameStatus} status
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @instance
                 */
                GameSnapshot.prototype.status = 0;

                /**
                 * GameSnapshot yourColor.
                 * @member {string} yourColor
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @instance
                 */
                GameSnapshot.prototype.yourColor = "";

                /**
                 * GameSnapshot lastAction.
                 * @member {string} lastAction
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @instance
                 */
                GameSnapshot.prototype.lastAction = "";

                /**
                 * Creates a new GameSnapshot instance using the specified properties.
                 * @function create
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @static
                 * @param {com.gomokumaster.proto.IGameSnapshot=} [properties] Properties to set
                 * @returns {com.gomokumaster.proto.GameSnapshot} GameSnapshot instance
                 */
                GameSnapshot.create = function create(properties) {
                    return new GameSnapshot(properties);
                };

                /**
                 * Encodes the specified GameSnapshot message. Does not implicitly {@link com.gomokumaster.proto.GameSnapshot.verify|verify} messages.
                 * @function encode
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @static
                 * @param {com.gomokumaster.proto.IGameSnapshot} message GameSnapshot message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                GameSnapshot.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomId);
                    if (message.board != null && message.board.length)
                        for (let i = 0; i < message.board.length; ++i)
                            $root.com.gomokumaster.proto.BoardRow.encode(message.board[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    if (message.yourInfo != null && Object.hasOwnProperty.call(message, "yourInfo"))
                        $root.com.gomokumaster.proto.Player.encode(message.yourInfo, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    if (message.opponent != null && Object.hasOwnProperty.call(message, "opponent"))
                        $root.com.gomokumaster.proto.Player.encode(message.opponent, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    if (message.currentTurnId != null && Object.hasOwnProperty.call(message, "currentTurnId"))
                        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.currentTurnId);
                    if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                        writer.uint32(/* id 6, wireType 0 =*/48).int32(message.status);
                    if (message.yourColor != null && Object.hasOwnProperty.call(message, "yourColor"))
                        writer.uint32(/* id 7, wireType 2 =*/58).string(message.yourColor);
                    if (message.lastAction != null && Object.hasOwnProperty.call(message, "lastAction"))
                        writer.uint32(/* id 8, wireType 2 =*/66).string(message.lastAction);
                    return writer;
                };

                /**
                 * Encodes the specified GameSnapshot message, length delimited. Does not implicitly {@link com.gomokumaster.proto.GameSnapshot.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @static
                 * @param {com.gomokumaster.proto.IGameSnapshot} message GameSnapshot message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                GameSnapshot.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a GameSnapshot message from the specified reader or buffer.
                 * @function decode
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {com.gomokumaster.proto.GameSnapshot} GameSnapshot
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                GameSnapshot.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.gomokumaster.proto.GameSnapshot();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.roomId = reader.string();
                                break;
                            }
                        case 2: {
                                if (!(message.board && message.board.length))
                                    message.board = [];
                                message.board.push($root.com.gomokumaster.proto.BoardRow.decode(reader, reader.uint32()));
                                break;
                            }
                        case 3: {
                                message.yourInfo = $root.com.gomokumaster.proto.Player.decode(reader, reader.uint32());
                                break;
                            }
                        case 4: {
                                message.opponent = $root.com.gomokumaster.proto.Player.decode(reader, reader.uint32());
                                break;
                            }
                        case 5: {
                                message.currentTurnId = reader.int32();
                                break;
                            }
                        case 6: {
                                message.status = reader.int32();
                                break;
                            }
                        case 7: {
                                message.yourColor = reader.string();
                                break;
                            }
                        case 8: {
                                message.lastAction = reader.string();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a GameSnapshot message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {com.gomokumaster.proto.GameSnapshot} GameSnapshot
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                GameSnapshot.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a GameSnapshot message.
                 * @function verify
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                GameSnapshot.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.roomId != null && message.hasOwnProperty("roomId"))
                        if (!$util.isString(message.roomId))
                            return "roomId: string expected";
                    if (message.board != null && message.hasOwnProperty("board")) {
                        if (!Array.isArray(message.board))
                            return "board: array expected";
                        for (let i = 0; i < message.board.length; ++i) {
                            let error = $root.com.gomokumaster.proto.BoardRow.verify(message.board[i]);
                            if (error)
                                return "board." + error;
                        }
                    }
                    if (message.yourInfo != null && message.hasOwnProperty("yourInfo")) {
                        let error = $root.com.gomokumaster.proto.Player.verify(message.yourInfo);
                        if (error)
                            return "yourInfo." + error;
                    }
                    if (message.opponent != null && message.hasOwnProperty("opponent")) {
                        let error = $root.com.gomokumaster.proto.Player.verify(message.opponent);
                        if (error)
                            return "opponent." + error;
                    }
                    if (message.currentTurnId != null && message.hasOwnProperty("currentTurnId"))
                        if (!$util.isInteger(message.currentTurnId))
                            return "currentTurnId: integer expected";
                    if (message.status != null && message.hasOwnProperty("status"))
                        switch (message.status) {
                        default:
                            return "status: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            break;
                        }
                    if (message.yourColor != null && message.hasOwnProperty("yourColor"))
                        if (!$util.isString(message.yourColor))
                            return "yourColor: string expected";
                    if (message.lastAction != null && message.hasOwnProperty("lastAction"))
                        if (!$util.isString(message.lastAction))
                            return "lastAction: string expected";
                    return null;
                };

                /**
                 * Creates a GameSnapshot message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {com.gomokumaster.proto.GameSnapshot} GameSnapshot
                 */
                GameSnapshot.fromObject = function fromObject(object) {
                    if (object instanceof $root.com.gomokumaster.proto.GameSnapshot)
                        return object;
                    let message = new $root.com.gomokumaster.proto.GameSnapshot();
                    if (object.roomId != null)
                        message.roomId = String(object.roomId);
                    if (object.board) {
                        if (!Array.isArray(object.board))
                            throw TypeError(".com.gomokumaster.proto.GameSnapshot.board: array expected");
                        message.board = [];
                        for (let i = 0; i < object.board.length; ++i) {
                            if (typeof object.board[i] !== "object")
                                throw TypeError(".com.gomokumaster.proto.GameSnapshot.board: object expected");
                            message.board[i] = $root.com.gomokumaster.proto.BoardRow.fromObject(object.board[i]);
                        }
                    }
                    if (object.yourInfo != null) {
                        if (typeof object.yourInfo !== "object")
                            throw TypeError(".com.gomokumaster.proto.GameSnapshot.yourInfo: object expected");
                        message.yourInfo = $root.com.gomokumaster.proto.Player.fromObject(object.yourInfo);
                    }
                    if (object.opponent != null) {
                        if (typeof object.opponent !== "object")
                            throw TypeError(".com.gomokumaster.proto.GameSnapshot.opponent: object expected");
                        message.opponent = $root.com.gomokumaster.proto.Player.fromObject(object.opponent);
                    }
                    if (object.currentTurnId != null)
                        message.currentTurnId = object.currentTurnId | 0;
                    switch (object.status) {
                    default:
                        if (typeof object.status === "number") {
                            message.status = object.status;
                            break;
                        }
                        break;
                    case "WAITING":
                    case 0:
                        message.status = 0;
                        break;
                    case "STARTED":
                    case 1:
                        message.status = 1;
                        break;
                    case "FINISHED":
                    case 2:
                        message.status = 2;
                        break;
                    case "PAUSED":
                    case 3:
                        message.status = 3;
                        break;
                    }
                    if (object.yourColor != null)
                        message.yourColor = String(object.yourColor);
                    if (object.lastAction != null)
                        message.lastAction = String(object.lastAction);
                    return message;
                };

                /**
                 * Creates a plain object from a GameSnapshot message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @static
                 * @param {com.gomokumaster.proto.GameSnapshot} message GameSnapshot
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                GameSnapshot.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.arrays || options.defaults)
                        object.board = [];
                    if (options.defaults) {
                        object.roomId = "";
                        object.yourInfo = null;
                        object.opponent = null;
                        object.currentTurnId = 0;
                        object.status = options.enums === String ? "WAITING" : 0;
                        object.yourColor = "";
                        object.lastAction = "";
                    }
                    if (message.roomId != null && message.hasOwnProperty("roomId"))
                        object.roomId = message.roomId;
                    if (message.board && message.board.length) {
                        object.board = [];
                        for (let j = 0; j < message.board.length; ++j)
                            object.board[j] = $root.com.gomokumaster.proto.BoardRow.toObject(message.board[j], options);
                    }
                    if (message.yourInfo != null && message.hasOwnProperty("yourInfo"))
                        object.yourInfo = $root.com.gomokumaster.proto.Player.toObject(message.yourInfo, options);
                    if (message.opponent != null && message.hasOwnProperty("opponent"))
                        object.opponent = $root.com.gomokumaster.proto.Player.toObject(message.opponent, options);
                    if (message.currentTurnId != null && message.hasOwnProperty("currentTurnId"))
                        object.currentTurnId = message.currentTurnId;
                    if (message.status != null && message.hasOwnProperty("status"))
                        object.status = options.enums === String ? $root.com.gomokumaster.proto.GameStatus[message.status] === undefined ? message.status : $root.com.gomokumaster.proto.GameStatus[message.status] : message.status;
                    if (message.yourColor != null && message.hasOwnProperty("yourColor"))
                        object.yourColor = message.yourColor;
                    if (message.lastAction != null && message.hasOwnProperty("lastAction"))
                        object.lastAction = message.lastAction;
                    return object;
                };

                /**
                 * Converts this GameSnapshot to JSON.
                 * @function toJSON
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                GameSnapshot.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for GameSnapshot
                 * @function getTypeUrl
                 * @memberof com.gomokumaster.proto.GameSnapshot
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                GameSnapshot.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/com.gomokumaster.proto.GameSnapshot";
                };

                return GameSnapshot;
            })();

            proto.BoardRow = (function() {

                /**
                 * Properties of a BoardRow.
                 * @memberof com.gomokumaster.proto
                 * @interface IBoardRow
                 * @property {Array.<com.gomokumaster.proto.IPiece>|null} [pieces] BoardRow pieces
                 */

                /**
                 * Constructs a new BoardRow.
                 * @memberof com.gomokumaster.proto
                 * @classdesc Represents a BoardRow.
                 * @implements IBoardRow
                 * @constructor
                 * @param {com.gomokumaster.proto.IBoardRow=} [properties] Properties to set
                 */
                function BoardRow(properties) {
                    this.pieces = [];
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * BoardRow pieces.
                 * @member {Array.<com.gomokumaster.proto.IPiece>} pieces
                 * @memberof com.gomokumaster.proto.BoardRow
                 * @instance
                 */
                BoardRow.prototype.pieces = $util.emptyArray;

                /**
                 * Creates a new BoardRow instance using the specified properties.
                 * @function create
                 * @memberof com.gomokumaster.proto.BoardRow
                 * @static
                 * @param {com.gomokumaster.proto.IBoardRow=} [properties] Properties to set
                 * @returns {com.gomokumaster.proto.BoardRow} BoardRow instance
                 */
                BoardRow.create = function create(properties) {
                    return new BoardRow(properties);
                };

                /**
                 * Encodes the specified BoardRow message. Does not implicitly {@link com.gomokumaster.proto.BoardRow.verify|verify} messages.
                 * @function encode
                 * @memberof com.gomokumaster.proto.BoardRow
                 * @static
                 * @param {com.gomokumaster.proto.IBoardRow} message BoardRow message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                BoardRow.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.pieces != null && message.pieces.length)
                        for (let i = 0; i < message.pieces.length; ++i)
                            $root.com.gomokumaster.proto.Piece.encode(message.pieces[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified BoardRow message, length delimited. Does not implicitly {@link com.gomokumaster.proto.BoardRow.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof com.gomokumaster.proto.BoardRow
                 * @static
                 * @param {com.gomokumaster.proto.IBoardRow} message BoardRow message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                BoardRow.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a BoardRow message from the specified reader or buffer.
                 * @function decode
                 * @memberof com.gomokumaster.proto.BoardRow
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {com.gomokumaster.proto.BoardRow} BoardRow
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                BoardRow.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.gomokumaster.proto.BoardRow();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                if (!(message.pieces && message.pieces.length))
                                    message.pieces = [];
                                message.pieces.push($root.com.gomokumaster.proto.Piece.decode(reader, reader.uint32()));
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a BoardRow message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof com.gomokumaster.proto.BoardRow
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {com.gomokumaster.proto.BoardRow} BoardRow
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                BoardRow.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a BoardRow message.
                 * @function verify
                 * @memberof com.gomokumaster.proto.BoardRow
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                BoardRow.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.pieces != null && message.hasOwnProperty("pieces")) {
                        if (!Array.isArray(message.pieces))
                            return "pieces: array expected";
                        for (let i = 0; i < message.pieces.length; ++i) {
                            let error = $root.com.gomokumaster.proto.Piece.verify(message.pieces[i]);
                            if (error)
                                return "pieces." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a BoardRow message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof com.gomokumaster.proto.BoardRow
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {com.gomokumaster.proto.BoardRow} BoardRow
                 */
                BoardRow.fromObject = function fromObject(object) {
                    if (object instanceof $root.com.gomokumaster.proto.BoardRow)
                        return object;
                    let message = new $root.com.gomokumaster.proto.BoardRow();
                    if (object.pieces) {
                        if (!Array.isArray(object.pieces))
                            throw TypeError(".com.gomokumaster.proto.BoardRow.pieces: array expected");
                        message.pieces = [];
                        for (let i = 0; i < object.pieces.length; ++i) {
                            if (typeof object.pieces[i] !== "object")
                                throw TypeError(".com.gomokumaster.proto.BoardRow.pieces: object expected");
                            message.pieces[i] = $root.com.gomokumaster.proto.Piece.fromObject(object.pieces[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a BoardRow message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof com.gomokumaster.proto.BoardRow
                 * @static
                 * @param {com.gomokumaster.proto.BoardRow} message BoardRow
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                BoardRow.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.arrays || options.defaults)
                        object.pieces = [];
                    if (message.pieces && message.pieces.length) {
                        object.pieces = [];
                        for (let j = 0; j < message.pieces.length; ++j)
                            object.pieces[j] = $root.com.gomokumaster.proto.Piece.toObject(message.pieces[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this BoardRow to JSON.
                 * @function toJSON
                 * @memberof com.gomokumaster.proto.BoardRow
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                BoardRow.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for BoardRow
                 * @function getTypeUrl
                 * @memberof com.gomokumaster.proto.BoardRow
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                BoardRow.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/com.gomokumaster.proto.BoardRow";
                };

                return BoardRow;
            })();

            proto.ServerNotice = (function() {

                /**
                 * Properties of a ServerNotice.
                 * @memberof com.gomokumaster.proto
                 * @interface IServerNotice
                 * @property {string|null} [message] ServerNotice message
                 */

                /**
                 * Constructs a new ServerNotice.
                 * @memberof com.gomokumaster.proto
                 * @classdesc Represents a ServerNotice.
                 * @implements IServerNotice
                 * @constructor
                 * @param {com.gomokumaster.proto.IServerNotice=} [properties] Properties to set
                 */
                function ServerNotice(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ServerNotice message.
                 * @member {string} message
                 * @memberof com.gomokumaster.proto.ServerNotice
                 * @instance
                 */
                ServerNotice.prototype.message = "";

                /**
                 * Creates a new ServerNotice instance using the specified properties.
                 * @function create
                 * @memberof com.gomokumaster.proto.ServerNotice
                 * @static
                 * @param {com.gomokumaster.proto.IServerNotice=} [properties] Properties to set
                 * @returns {com.gomokumaster.proto.ServerNotice} ServerNotice instance
                 */
                ServerNotice.create = function create(properties) {
                    return new ServerNotice(properties);
                };

                /**
                 * Encodes the specified ServerNotice message. Does not implicitly {@link com.gomokumaster.proto.ServerNotice.verify|verify} messages.
                 * @function encode
                 * @memberof com.gomokumaster.proto.ServerNotice
                 * @static
                 * @param {com.gomokumaster.proto.IServerNotice} message ServerNotice message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ServerNotice.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.message);
                    return writer;
                };

                /**
                 * Encodes the specified ServerNotice message, length delimited. Does not implicitly {@link com.gomokumaster.proto.ServerNotice.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof com.gomokumaster.proto.ServerNotice
                 * @static
                 * @param {com.gomokumaster.proto.IServerNotice} message ServerNotice message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ServerNotice.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ServerNotice message from the specified reader or buffer.
                 * @function decode
                 * @memberof com.gomokumaster.proto.ServerNotice
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {com.gomokumaster.proto.ServerNotice} ServerNotice
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ServerNotice.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.gomokumaster.proto.ServerNotice();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.message = reader.string();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ServerNotice message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof com.gomokumaster.proto.ServerNotice
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {com.gomokumaster.proto.ServerNotice} ServerNotice
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ServerNotice.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ServerNotice message.
                 * @function verify
                 * @memberof com.gomokumaster.proto.ServerNotice
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ServerNotice.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.message != null && message.hasOwnProperty("message"))
                        if (!$util.isString(message.message))
                            return "message: string expected";
                    return null;
                };

                /**
                 * Creates a ServerNotice message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof com.gomokumaster.proto.ServerNotice
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {com.gomokumaster.proto.ServerNotice} ServerNotice
                 */
                ServerNotice.fromObject = function fromObject(object) {
                    if (object instanceof $root.com.gomokumaster.proto.ServerNotice)
                        return object;
                    let message = new $root.com.gomokumaster.proto.ServerNotice();
                    if (object.message != null)
                        message.message = String(object.message);
                    return message;
                };

                /**
                 * Creates a plain object from a ServerNotice message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof com.gomokumaster.proto.ServerNotice
                 * @static
                 * @param {com.gomokumaster.proto.ServerNotice} message ServerNotice
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ServerNotice.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults)
                        object.message = "";
                    if (message.message != null && message.hasOwnProperty("message"))
                        object.message = message.message;
                    return object;
                };

                /**
                 * Converts this ServerNotice to JSON.
                 * @function toJSON
                 * @memberof com.gomokumaster.proto.ServerNotice
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ServerNotice.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for ServerNotice
                 * @function getTypeUrl
                 * @memberof com.gomokumaster.proto.ServerNotice
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                ServerNotice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/com.gomokumaster.proto.ServerNotice";
                };

                return ServerNotice;
            })();

            proto.ChatReq = (function() {

                /**
                 * Properties of a ChatReq.
                 * @memberof com.gomokumaster.proto
                 * @interface IChatReq
                 * @property {string|null} [id] ChatReq id
                 * @property {number|null} [senderColor] ChatReq senderColor
                 * @property {string|null} [time] ChatReq time
                 * @property {string|null} [text] ChatReq text
                 */

                /**
                 * Constructs a new ChatReq.
                 * @memberof com.gomokumaster.proto
                 * @classdesc Represents a ChatReq.
                 * @implements IChatReq
                 * @constructor
                 * @param {com.gomokumaster.proto.IChatReq=} [properties] Properties to set
                 */
                function ChatReq(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ChatReq id.
                 * @member {string} id
                 * @memberof com.gomokumaster.proto.ChatReq
                 * @instance
                 */
                ChatReq.prototype.id = "";

                /**
                 * ChatReq senderColor.
                 * @member {number} senderColor
                 * @memberof com.gomokumaster.proto.ChatReq
                 * @instance
                 */
                ChatReq.prototype.senderColor = 0;

                /**
                 * ChatReq time.
                 * @member {string} time
                 * @memberof com.gomokumaster.proto.ChatReq
                 * @instance
                 */
                ChatReq.prototype.time = "";

                /**
                 * ChatReq text.
                 * @member {string} text
                 * @memberof com.gomokumaster.proto.ChatReq
                 * @instance
                 */
                ChatReq.prototype.text = "";

                /**
                 * Creates a new ChatReq instance using the specified properties.
                 * @function create
                 * @memberof com.gomokumaster.proto.ChatReq
                 * @static
                 * @param {com.gomokumaster.proto.IChatReq=} [properties] Properties to set
                 * @returns {com.gomokumaster.proto.ChatReq} ChatReq instance
                 */
                ChatReq.create = function create(properties) {
                    return new ChatReq(properties);
                };

                /**
                 * Encodes the specified ChatReq message. Does not implicitly {@link com.gomokumaster.proto.ChatReq.verify|verify} messages.
                 * @function encode
                 * @memberof com.gomokumaster.proto.ChatReq
                 * @static
                 * @param {com.gomokumaster.proto.IChatReq} message ChatReq message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ChatReq.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                    if (message.senderColor != null && Object.hasOwnProperty.call(message, "senderColor"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.senderColor);
                    if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.time);
                    if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.text);
                    return writer;
                };

                /**
                 * Encodes the specified ChatReq message, length delimited. Does not implicitly {@link com.gomokumaster.proto.ChatReq.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof com.gomokumaster.proto.ChatReq
                 * @static
                 * @param {com.gomokumaster.proto.IChatReq} message ChatReq message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ChatReq.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ChatReq message from the specified reader or buffer.
                 * @function decode
                 * @memberof com.gomokumaster.proto.ChatReq
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {com.gomokumaster.proto.ChatReq} ChatReq
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ChatReq.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.gomokumaster.proto.ChatReq();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.id = reader.string();
                                break;
                            }
                        case 2: {
                                message.senderColor = reader.int32();
                                break;
                            }
                        case 3: {
                                message.time = reader.string();
                                break;
                            }
                        case 4: {
                                message.text = reader.string();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ChatReq message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof com.gomokumaster.proto.ChatReq
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {com.gomokumaster.proto.ChatReq} ChatReq
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ChatReq.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ChatReq message.
                 * @function verify
                 * @memberof com.gomokumaster.proto.ChatReq
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ChatReq.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isString(message.id))
                            return "id: string expected";
                    if (message.senderColor != null && message.hasOwnProperty("senderColor"))
                        if (!$util.isInteger(message.senderColor))
                            return "senderColor: integer expected";
                    if (message.time != null && message.hasOwnProperty("time"))
                        if (!$util.isString(message.time))
                            return "time: string expected";
                    if (message.text != null && message.hasOwnProperty("text"))
                        if (!$util.isString(message.text))
                            return "text: string expected";
                    return null;
                };

                /**
                 * Creates a ChatReq message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof com.gomokumaster.proto.ChatReq
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {com.gomokumaster.proto.ChatReq} ChatReq
                 */
                ChatReq.fromObject = function fromObject(object) {
                    if (object instanceof $root.com.gomokumaster.proto.ChatReq)
                        return object;
                    let message = new $root.com.gomokumaster.proto.ChatReq();
                    if (object.id != null)
                        message.id = String(object.id);
                    if (object.senderColor != null)
                        message.senderColor = object.senderColor | 0;
                    if (object.time != null)
                        message.time = String(object.time);
                    if (object.text != null)
                        message.text = String(object.text);
                    return message;
                };

                /**
                 * Creates a plain object from a ChatReq message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof com.gomokumaster.proto.ChatReq
                 * @static
                 * @param {com.gomokumaster.proto.ChatReq} message ChatReq
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ChatReq.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        object.id = "";
                        object.senderColor = 0;
                        object.time = "";
                        object.text = "";
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.senderColor != null && message.hasOwnProperty("senderColor"))
                        object.senderColor = message.senderColor;
                    if (message.time != null && message.hasOwnProperty("time"))
                        object.time = message.time;
                    if (message.text != null && message.hasOwnProperty("text"))
                        object.text = message.text;
                    return object;
                };

                /**
                 * Converts this ChatReq to JSON.
                 * @function toJSON
                 * @memberof com.gomokumaster.proto.ChatReq
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ChatReq.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for ChatReq
                 * @function getTypeUrl
                 * @memberof com.gomokumaster.proto.ChatReq
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                ChatReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/com.gomokumaster.proto.ChatReq";
                };

                return ChatReq;
            })();

            proto.Surrender = (function() {

                /**
                 * Properties of a Surrender.
                 * @memberof com.gomokumaster.proto
                 * @interface ISurrender
                 * @property {string|null} [id] Surrender id
                 * @property {string|null} [time] Surrender time
                 * @property {string|null} [text] Surrender text
                 * @property {boolean|null} [isSelf] Surrender isSelf
                 */

                /**
                 * Constructs a new Surrender.
                 * @memberof com.gomokumaster.proto
                 * @classdesc Represents a Surrender.
                 * @implements ISurrender
                 * @constructor
                 * @param {com.gomokumaster.proto.ISurrender=} [properties] Properties to set
                 */
                function Surrender(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Surrender id.
                 * @member {string} id
                 * @memberof com.gomokumaster.proto.Surrender
                 * @instance
                 */
                Surrender.prototype.id = "";

                /**
                 * Surrender time.
                 * @member {string} time
                 * @memberof com.gomokumaster.proto.Surrender
                 * @instance
                 */
                Surrender.prototype.time = "";

                /**
                 * Surrender text.
                 * @member {string} text
                 * @memberof com.gomokumaster.proto.Surrender
                 * @instance
                 */
                Surrender.prototype.text = "";

                /**
                 * Surrender isSelf.
                 * @member {boolean} isSelf
                 * @memberof com.gomokumaster.proto.Surrender
                 * @instance
                 */
                Surrender.prototype.isSelf = false;

                /**
                 * Creates a new Surrender instance using the specified properties.
                 * @function create
                 * @memberof com.gomokumaster.proto.Surrender
                 * @static
                 * @param {com.gomokumaster.proto.ISurrender=} [properties] Properties to set
                 * @returns {com.gomokumaster.proto.Surrender} Surrender instance
                 */
                Surrender.create = function create(properties) {
                    return new Surrender(properties);
                };

                /**
                 * Encodes the specified Surrender message. Does not implicitly {@link com.gomokumaster.proto.Surrender.verify|verify} messages.
                 * @function encode
                 * @memberof com.gomokumaster.proto.Surrender
                 * @static
                 * @param {com.gomokumaster.proto.ISurrender} message Surrender message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Surrender.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                    if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.time);
                    if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.text);
                    if (message.isSelf != null && Object.hasOwnProperty.call(message, "isSelf"))
                        writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isSelf);
                    return writer;
                };

                /**
                 * Encodes the specified Surrender message, length delimited. Does not implicitly {@link com.gomokumaster.proto.Surrender.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof com.gomokumaster.proto.Surrender
                 * @static
                 * @param {com.gomokumaster.proto.ISurrender} message Surrender message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Surrender.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Surrender message from the specified reader or buffer.
                 * @function decode
                 * @memberof com.gomokumaster.proto.Surrender
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {com.gomokumaster.proto.Surrender} Surrender
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Surrender.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.gomokumaster.proto.Surrender();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.id = reader.string();
                                break;
                            }
                        case 2: {
                                message.time = reader.string();
                                break;
                            }
                        case 3: {
                                message.text = reader.string();
                                break;
                            }
                        case 4: {
                                message.isSelf = reader.bool();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Surrender message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof com.gomokumaster.proto.Surrender
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {com.gomokumaster.proto.Surrender} Surrender
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Surrender.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Surrender message.
                 * @function verify
                 * @memberof com.gomokumaster.proto.Surrender
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Surrender.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isString(message.id))
                            return "id: string expected";
                    if (message.time != null && message.hasOwnProperty("time"))
                        if (!$util.isString(message.time))
                            return "time: string expected";
                    if (message.text != null && message.hasOwnProperty("text"))
                        if (!$util.isString(message.text))
                            return "text: string expected";
                    if (message.isSelf != null && message.hasOwnProperty("isSelf"))
                        if (typeof message.isSelf !== "boolean")
                            return "isSelf: boolean expected";
                    return null;
                };

                /**
                 * Creates a Surrender message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof com.gomokumaster.proto.Surrender
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {com.gomokumaster.proto.Surrender} Surrender
                 */
                Surrender.fromObject = function fromObject(object) {
                    if (object instanceof $root.com.gomokumaster.proto.Surrender)
                        return object;
                    let message = new $root.com.gomokumaster.proto.Surrender();
                    if (object.id != null)
                        message.id = String(object.id);
                    if (object.time != null)
                        message.time = String(object.time);
                    if (object.text != null)
                        message.text = String(object.text);
                    if (object.isSelf != null)
                        message.isSelf = Boolean(object.isSelf);
                    return message;
                };

                /**
                 * Creates a plain object from a Surrender message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof com.gomokumaster.proto.Surrender
                 * @static
                 * @param {com.gomokumaster.proto.Surrender} message Surrender
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Surrender.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        object.id = "";
                        object.time = "";
                        object.text = "";
                        object.isSelf = false;
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.time != null && message.hasOwnProperty("time"))
                        object.time = message.time;
                    if (message.text != null && message.hasOwnProperty("text"))
                        object.text = message.text;
                    if (message.isSelf != null && message.hasOwnProperty("isSelf"))
                        object.isSelf = message.isSelf;
                    return object;
                };

                /**
                 * Converts this Surrender to JSON.
                 * @function toJSON
                 * @memberof com.gomokumaster.proto.Surrender
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Surrender.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Surrender
                 * @function getTypeUrl
                 * @memberof com.gomokumaster.proto.Surrender
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Surrender.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/com.gomokumaster.proto.Surrender";
                };

                return Surrender;
            })();

            proto.GamePacket = (function() {

                /**
                 * Properties of a GamePacket.
                 * @memberof com.gomokumaster.proto
                 * @interface IGamePacket
                 * @property {com.gomokumaster.proto.MsgType|null} [type] GamePacket type
                 * @property {com.gomokumaster.proto.IMoveReq|null} [moveReq] GamePacket moveReq
                 * @property {com.gomokumaster.proto.IGameSnapshot|null} [gameSnapshot] GamePacket gameSnapshot
                 * @property {com.gomokumaster.proto.IServerNotice|null} [notice] GamePacket notice
                 * @property {com.gomokumaster.proto.IChatReq|null} [chatReq] GamePacket chatReq
                 * @property {com.gomokumaster.proto.ISurrender|null} [surrender] GamePacket surrender
                 * @property {string|null} [winnerId] GamePacket winnerId
                 * @property {number|Long|null} [turnDeadline] GamePacket turnDeadline
                 */

                /**
                 * Constructs a new GamePacket.
                 * @memberof com.gomokumaster.proto
                 * @classdesc Represents a GamePacket.
                 * @implements IGamePacket
                 * @constructor
                 * @param {com.gomokumaster.proto.IGamePacket=} [properties] Properties to set
                 */
                function GamePacket(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * GamePacket type.
                 * @member {com.gomokumaster.proto.MsgType} type
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @instance
                 */
                GamePacket.prototype.type = 0;

                /**
                 * GamePacket moveReq.
                 * @member {com.gomokumaster.proto.IMoveReq|null|undefined} moveReq
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @instance
                 */
                GamePacket.prototype.moveReq = null;

                /**
                 * GamePacket gameSnapshot.
                 * @member {com.gomokumaster.proto.IGameSnapshot|null|undefined} gameSnapshot
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @instance
                 */
                GamePacket.prototype.gameSnapshot = null;

                /**
                 * GamePacket notice.
                 * @member {com.gomokumaster.proto.IServerNotice|null|undefined} notice
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @instance
                 */
                GamePacket.prototype.notice = null;

                /**
                 * GamePacket chatReq.
                 * @member {com.gomokumaster.proto.IChatReq|null|undefined} chatReq
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @instance
                 */
                GamePacket.prototype.chatReq = null;

                /**
                 * GamePacket surrender.
                 * @member {com.gomokumaster.proto.ISurrender|null|undefined} surrender
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @instance
                 */
                GamePacket.prototype.surrender = null;

                /**
                 * GamePacket winnerId.
                 * @member {string|null|undefined} winnerId
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @instance
                 */
                GamePacket.prototype.winnerId = null;

                /**
                 * GamePacket turnDeadline.
                 * @member {number|Long|null|undefined} turnDeadline
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @instance
                 */
                GamePacket.prototype.turnDeadline = null;

                // OneOf field names bound to virtual getters and setters
                let $oneOfFields;

                /**
                 * GamePacket body.
                 * @member {"moveReq"|"gameSnapshot"|"notice"|"chatReq"|"surrender"|"winnerId"|"turnDeadline"|undefined} body
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @instance
                 */
                Object.defineProperty(GamePacket.prototype, "body", {
                    get: $util.oneOfGetter($oneOfFields = ["moveReq", "gameSnapshot", "notice", "chatReq", "surrender", "winnerId", "turnDeadline"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new GamePacket instance using the specified properties.
                 * @function create
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @static
                 * @param {com.gomokumaster.proto.IGamePacket=} [properties] Properties to set
                 * @returns {com.gomokumaster.proto.GamePacket} GamePacket instance
                 */
                GamePacket.create = function create(properties) {
                    return new GamePacket(properties);
                };

                /**
                 * Encodes the specified GamePacket message. Does not implicitly {@link com.gomokumaster.proto.GamePacket.verify|verify} messages.
                 * @function encode
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @static
                 * @param {com.gomokumaster.proto.IGamePacket} message GamePacket message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                GamePacket.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                    if (message.moveReq != null && Object.hasOwnProperty.call(message, "moveReq"))
                        $root.com.gomokumaster.proto.MoveReq.encode(message.moveReq, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    if (message.gameSnapshot != null && Object.hasOwnProperty.call(message, "gameSnapshot"))
                        $root.com.gomokumaster.proto.GameSnapshot.encode(message.gameSnapshot, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    if (message.notice != null && Object.hasOwnProperty.call(message, "notice"))
                        $root.com.gomokumaster.proto.ServerNotice.encode(message.notice, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    if (message.chatReq != null && Object.hasOwnProperty.call(message, "chatReq"))
                        $root.com.gomokumaster.proto.ChatReq.encode(message.chatReq, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                    if (message.surrender != null && Object.hasOwnProperty.call(message, "surrender"))
                        $root.com.gomokumaster.proto.Surrender.encode(message.surrender, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                    if (message.winnerId != null && Object.hasOwnProperty.call(message, "winnerId"))
                        writer.uint32(/* id 7, wireType 2 =*/58).string(message.winnerId);
                    if (message.turnDeadline != null && Object.hasOwnProperty.call(message, "turnDeadline"))
                        writer.uint32(/* id 10, wireType 0 =*/80).int64(message.turnDeadline);
                    return writer;
                };

                /**
                 * Encodes the specified GamePacket message, length delimited. Does not implicitly {@link com.gomokumaster.proto.GamePacket.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @static
                 * @param {com.gomokumaster.proto.IGamePacket} message GamePacket message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                GamePacket.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a GamePacket message from the specified reader or buffer.
                 * @function decode
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {com.gomokumaster.proto.GamePacket} GamePacket
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                GamePacket.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.gomokumaster.proto.GamePacket();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.type = reader.int32();
                                break;
                            }
                        case 2: {
                                message.moveReq = $root.com.gomokumaster.proto.MoveReq.decode(reader, reader.uint32());
                                break;
                            }
                        case 3: {
                                message.gameSnapshot = $root.com.gomokumaster.proto.GameSnapshot.decode(reader, reader.uint32());
                                break;
                            }
                        case 4: {
                                message.notice = $root.com.gomokumaster.proto.ServerNotice.decode(reader, reader.uint32());
                                break;
                            }
                        case 5: {
                                message.chatReq = $root.com.gomokumaster.proto.ChatReq.decode(reader, reader.uint32());
                                break;
                            }
                        case 6: {
                                message.surrender = $root.com.gomokumaster.proto.Surrender.decode(reader, reader.uint32());
                                break;
                            }
                        case 7: {
                                message.winnerId = reader.string();
                                break;
                            }
                        case 10: {
                                message.turnDeadline = reader.int64();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a GamePacket message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {com.gomokumaster.proto.GamePacket} GamePacket
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                GamePacket.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a GamePacket message.
                 * @function verify
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                GamePacket.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    let properties = {};
                    if (message.type != null && message.hasOwnProperty("type"))
                        switch (message.type) {
                        default:
                            return "type: enum value expected";
                        case 0:
                        case 1001:
                        case 1002:
                        case 1003:
                        case 1004:
                        case 1005:
                        case 1006:
                        case 1007:
                        case 1008:
                        case 1009:
                        case 1011:
                        case 1012:
                        case 1013:
                        case 1014:
                        case 1015:
                            break;
                        }
                    if (message.moveReq != null && message.hasOwnProperty("moveReq")) {
                        properties.body = 1;
                        {
                            let error = $root.com.gomokumaster.proto.MoveReq.verify(message.moveReq);
                            if (error)
                                return "moveReq." + error;
                        }
                    }
                    if (message.gameSnapshot != null && message.hasOwnProperty("gameSnapshot")) {
                        if (properties.body === 1)
                            return "body: multiple values";
                        properties.body = 1;
                        {
                            let error = $root.com.gomokumaster.proto.GameSnapshot.verify(message.gameSnapshot);
                            if (error)
                                return "gameSnapshot." + error;
                        }
                    }
                    if (message.notice != null && message.hasOwnProperty("notice")) {
                        if (properties.body === 1)
                            return "body: multiple values";
                        properties.body = 1;
                        {
                            let error = $root.com.gomokumaster.proto.ServerNotice.verify(message.notice);
                            if (error)
                                return "notice." + error;
                        }
                    }
                    if (message.chatReq != null && message.hasOwnProperty("chatReq")) {
                        if (properties.body === 1)
                            return "body: multiple values";
                        properties.body = 1;
                        {
                            let error = $root.com.gomokumaster.proto.ChatReq.verify(message.chatReq);
                            if (error)
                                return "chatReq." + error;
                        }
                    }
                    if (message.surrender != null && message.hasOwnProperty("surrender")) {
                        if (properties.body === 1)
                            return "body: multiple values";
                        properties.body = 1;
                        {
                            let error = $root.com.gomokumaster.proto.Surrender.verify(message.surrender);
                            if (error)
                                return "surrender." + error;
                        }
                    }
                    if (message.winnerId != null && message.hasOwnProperty("winnerId")) {
                        if (properties.body === 1)
                            return "body: multiple values";
                        properties.body = 1;
                        if (!$util.isString(message.winnerId))
                            return "winnerId: string expected";
                    }
                    if (message.turnDeadline != null && message.hasOwnProperty("turnDeadline")) {
                        if (properties.body === 1)
                            return "body: multiple values";
                        properties.body = 1;
                        if (!$util.isInteger(message.turnDeadline) && !(message.turnDeadline && $util.isInteger(message.turnDeadline.low) && $util.isInteger(message.turnDeadline.high)))
                            return "turnDeadline: integer|Long expected";
                    }
                    return null;
                };

                /**
                 * Creates a GamePacket message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {com.gomokumaster.proto.GamePacket} GamePacket
                 */
                GamePacket.fromObject = function fromObject(object) {
                    if (object instanceof $root.com.gomokumaster.proto.GamePacket)
                        return object;
                    let message = new $root.com.gomokumaster.proto.GamePacket();
                    switch (object.type) {
                    default:
                        if (typeof object.type === "number") {
                            message.type = object.type;
                            break;
                        }
                        break;
                    case "UNKNOWN":
                    case 0:
                        message.type = 0;
                        break;
                    case "MATCH_REQ":
                    case 1001:
                        message.type = 1001;
                        break;
                    case "MATCH_CANCEL":
                    case 1002:
                        message.type = 1002;
                        break;
                    case "MATCH_RES":
                    case 1003:
                        message.type = 1003;
                        break;
                    case "MOVE_REQ":
                    case 1004:
                        message.type = 1004;
                        break;
                    case "BOARD_UPDATE":
                    case 1005:
                        message.type = 1005;
                        break;
                    case "GAME_OVER":
                    case 1006:
                        message.type = 1006;
                        break;
                    case "CHAT_REQ":
                    case 1007:
                        message.type = 1007;
                        break;
                    case "CHAT_RES":
                    case 1008:
                        message.type = 1008;
                        break;
                    case "ERROR":
                    case 1009:
                        message.type = 1009;
                        break;
                    case "SURRENDER":
                    case 1011:
                        message.type = 1011;
                        break;
                    case "CONNECT":
                    case 1012:
                        message.type = 1012;
                        break;
                    case "GAME_RESUME":
                    case 1013:
                        message.type = 1013;
                        break;
                    case "HEARTBEAT":
                    case 1014:
                        message.type = 1014;
                        break;
                    case "GAME_DISCONNECT":
                    case 1015:
                        message.type = 1015;
                        break;
                    }
                    if (object.moveReq != null) {
                        if (typeof object.moveReq !== "object")
                            throw TypeError(".com.gomokumaster.proto.GamePacket.moveReq: object expected");
                        message.moveReq = $root.com.gomokumaster.proto.MoveReq.fromObject(object.moveReq);
                    }
                    if (object.gameSnapshot != null) {
                        if (typeof object.gameSnapshot !== "object")
                            throw TypeError(".com.gomokumaster.proto.GamePacket.gameSnapshot: object expected");
                        message.gameSnapshot = $root.com.gomokumaster.proto.GameSnapshot.fromObject(object.gameSnapshot);
                    }
                    if (object.notice != null) {
                        if (typeof object.notice !== "object")
                            throw TypeError(".com.gomokumaster.proto.GamePacket.notice: object expected");
                        message.notice = $root.com.gomokumaster.proto.ServerNotice.fromObject(object.notice);
                    }
                    if (object.chatReq != null) {
                        if (typeof object.chatReq !== "object")
                            throw TypeError(".com.gomokumaster.proto.GamePacket.chatReq: object expected");
                        message.chatReq = $root.com.gomokumaster.proto.ChatReq.fromObject(object.chatReq);
                    }
                    if (object.surrender != null) {
                        if (typeof object.surrender !== "object")
                            throw TypeError(".com.gomokumaster.proto.GamePacket.surrender: object expected");
                        message.surrender = $root.com.gomokumaster.proto.Surrender.fromObject(object.surrender);
                    }
                    if (object.winnerId != null)
                        message.winnerId = String(object.winnerId);
                    if (object.turnDeadline != null)
                        if ($util.Long)
                            (message.turnDeadline = $util.Long.fromValue(object.turnDeadline)).unsigned = false;
                        else if (typeof object.turnDeadline === "string")
                            message.turnDeadline = parseInt(object.turnDeadline, 10);
                        else if (typeof object.turnDeadline === "number")
                            message.turnDeadline = object.turnDeadline;
                        else if (typeof object.turnDeadline === "object")
                            message.turnDeadline = new $util.LongBits(object.turnDeadline.low >>> 0, object.turnDeadline.high >>> 0).toNumber();
                    return message;
                };

                /**
                 * Creates a plain object from a GamePacket message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @static
                 * @param {com.gomokumaster.proto.GamePacket} message GamePacket
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                GamePacket.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults)
                        object.type = options.enums === String ? "UNKNOWN" : 0;
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = options.enums === String ? $root.com.gomokumaster.proto.MsgType[message.type] === undefined ? message.type : $root.com.gomokumaster.proto.MsgType[message.type] : message.type;
                    if (message.moveReq != null && message.hasOwnProperty("moveReq")) {
                        object.moveReq = $root.com.gomokumaster.proto.MoveReq.toObject(message.moveReq, options);
                        if (options.oneofs)
                            object.body = "moveReq";
                    }
                    if (message.gameSnapshot != null && message.hasOwnProperty("gameSnapshot")) {
                        object.gameSnapshot = $root.com.gomokumaster.proto.GameSnapshot.toObject(message.gameSnapshot, options);
                        if (options.oneofs)
                            object.body = "gameSnapshot";
                    }
                    if (message.notice != null && message.hasOwnProperty("notice")) {
                        object.notice = $root.com.gomokumaster.proto.ServerNotice.toObject(message.notice, options);
                        if (options.oneofs)
                            object.body = "notice";
                    }
                    if (message.chatReq != null && message.hasOwnProperty("chatReq")) {
                        object.chatReq = $root.com.gomokumaster.proto.ChatReq.toObject(message.chatReq, options);
                        if (options.oneofs)
                            object.body = "chatReq";
                    }
                    if (message.surrender != null && message.hasOwnProperty("surrender")) {
                        object.surrender = $root.com.gomokumaster.proto.Surrender.toObject(message.surrender, options);
                        if (options.oneofs)
                            object.body = "surrender";
                    }
                    if (message.winnerId != null && message.hasOwnProperty("winnerId")) {
                        object.winnerId = message.winnerId;
                        if (options.oneofs)
                            object.body = "winnerId";
                    }
                    if (message.turnDeadline != null && message.hasOwnProperty("turnDeadline")) {
                        if (typeof message.turnDeadline === "number")
                            object.turnDeadline = options.longs === String ? String(message.turnDeadline) : message.turnDeadline;
                        else
                            object.turnDeadline = options.longs === String ? $util.Long.prototype.toString.call(message.turnDeadline) : options.longs === Number ? new $util.LongBits(message.turnDeadline.low >>> 0, message.turnDeadline.high >>> 0).toNumber() : message.turnDeadline;
                        if (options.oneofs)
                            object.body = "turnDeadline";
                    }
                    return object;
                };

                /**
                 * Converts this GamePacket to JSON.
                 * @function toJSON
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                GamePacket.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for GamePacket
                 * @function getTypeUrl
                 * @memberof com.gomokumaster.proto.GamePacket
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                GamePacket.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/com.gomokumaster.proto.GamePacket";
                };

                return GamePacket;
            })();

            return proto;
        })();

        return gomokumaster;
    })();

    return com;
})();

export { $root as default };
