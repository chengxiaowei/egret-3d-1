﻿module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.MathUtil
    * @classdesc
    * 可使用 MathUtil 类 进行3d矩阵的计算
    * @includeExample geom/MathUtil.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    export class MathUtil {

        /**
        * @language zh_CN
        * 1弧度为多少角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        public static RADIANS_TO_DEGREES: number = 180 / Math.PI;

        /**
        * @language zh_CN
        * 1角度为多少弧度
        * @version Egret 3.0
        * @platform Web,Native
        */
        public static DEGREES_TO_RADIANS: number = Math.PI / 180;

        /**
        * @language zh_CN
        * 整型最大值
        * @version Egret 3.0
        * @platform Web,Native
        */
        public static MAX_VALUE: number = 0x7fffffff;

        /**
        * @language zh_CN
        * 整型最小值
        * @version Egret 3.0
        * @platform Web,Native
        */
        public static MIN_VALUE: number = -0x7fffffff;

        /**
        * @private
        * 1角度为多少弧度
        * @version Egret 3.0
        * @platform Web,Native
        */
        public static RAW_DATA_CONTAINER: Float32Array = new Float32Array(16);

        /**
        * @private
        */
        public static CALCULATION_MATRIX: Matrix4_4 = new Matrix4_4();

        /**
        * @private
        */
        public static CALCULATION_QUATERNION: Quaternion = new Quaternion();

        /**
        * @private
        */
        public static CALCULATION_VECTOR3D: Vector3D = new Vector3D();

        /**
        * @private
        */
        public static CALCULATION_VECTOR3D_0: Vector3D = new Vector3D();

        /**
        * @private
        */
        public static CALCULATION_VECTOR3D_1: Vector3D = new Vector3D();

        /**
        * @private
        */
        public static CALCULATION_VECTOR3D_2: Vector3D = new Vector3D();


        /**
        * @private
        * @language zh_CN
        * 两个Float是否相等
        * @param f0 float
        * @param f1 float
        * @returns boolean 是否相等
        * @version Egret 3.0
        * @platform Web,Native
        */
        public static FloatEqual(f0: number, f1: number): boolean {
            return Math.abs(f0 - f1) < 0.00000001;
        }

        /**
        * @private
        * @language zh_CN
        * 四元数转矩阵
        * @param quarternion 源四元数
        * @param m 目标矩阵 默认为null 如果为null将会new 一个Matrix4_4
        * @returns 返回转出矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        public static quaternion2matrix(quarternion: Quaternion, m: Matrix4_4 = null): Matrix4_4 {
            var x: number = quarternion.x;
            var y: number = quarternion.y;
            var z: number = quarternion.z;
            var w: number = quarternion.w;

            var xx: number = x * x;
            var xy: number = x * y;
            var xz: number = x * z;
            var xw: number = x * w;

            var yy: number = y * y;
            var yz: number = y * z;
            var yw: number = y * w;

            var zz: number = z * z;
            var zw: number = z * w;

            var raw: Float32Array = MathUtil.RAW_DATA_CONTAINER;
            raw[0] = 1 - 2 * (yy + zz);
            raw[1] = 2 * (xy + zw);
            raw[2] = 2 * (xz - yw);
            raw[4] = 2 * (xy - zw);
            raw[5] = 1 - 2 * (xx + zz);
            raw[6] = 2 * (yz + xw);
            raw[8] = 2 * (xz + yw);
            raw[9] = 2 * (yz - xw);
            raw[10] = 1 - 2 * (xx + yy);
            raw[3] = raw[7] = raw[11] = raw[12] = raw[13] = raw[14] = 0;
            raw[15] = 1;

            if (m) {
                m.copyRawDataFrom(raw);
                return m;
            } else
                return new Matrix4_4(new Float32Array(raw));
        }

        /**
        * @private
        * @language zh_CN
        * 得到矩阵朝前的方向
        * @param m 源矩阵
        * @param v 返回的方向 可为null 如果为null将会new 一个Vector3D
        * @returns Vector3D 返回方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        public static getForward(m: Matrix4_4, v: Vector3D = null): Vector3D {
            if (v === null) {
                v = new Vector3D(0.0, 0.0, 0.0);
            }

            m.copyRowTo(2, v);
            v.normalize();
            return v;
        }

        /**
        * @private
        * @language zh_CN
        * 得到矩阵朝上的方向
        * @param m 源矩阵
        * @param v 返回的方向 可为null 如果为null将会new 一个Vector3D
        * @returns Vector3D 返回方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        public static getUp(m: Matrix4_4, v: Vector3D = null): Vector3D {
            //v ||= new Vector3D(0.0, 0.0, 0.0);

            if (v === null) {

                v = new Vector3D(0.0, 0.0, 0.0);

            }

            m.copyRowTo(1, v);
            v.normalize();

            return v;
        }

        /**
        * @private
        * @language zh_CN
        * 得到矩阵朝右的方向
        * @param m 源矩阵
        * @param v 返回的方向 可为null 如果为null将会new 一个Vector3D
        * @returns Vector3D 返回方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        public static getRight(m: Matrix4_4, v: Vector3D = null): Vector3D {
            //v ||= new Vector3D(0.0, 0.0, 0.0);
            if (v === null) {

                v = new Vector3D(0.0, 0.0, 0.0);

            }

            m.copyRowTo(0, v);
            v.normalize();

            return v;
        }

        /**
        * @private
        * @language zh_CN
        * 比较两个矩阵是否相同
        * @param m1 矩阵1
        * @param m2 矩阵2
        * @returns boolean 相同返回true
        * @version Egret 3.0
        * @platform Web,Native
        */
        public static compare(m1: Matrix4_4, m2: Matrix4_4): boolean {
            var r1: Float32Array = MathUtil.RAW_DATA_CONTAINER;
            var r2: Float32Array = m2.rawData;
            m1.copyRawDataTo(r1);

            for (var i: number = 0; i < 16; ++i) {
                if (r1[i] != r2[i])
                    return false;
            }

            return true;
        }

        /**
        * @private
        * @language zh_CN
        * 得到平面的反射矩阵
        * @param plane 反射的面
        * @param target 计算返回的矩阵 可为null 如果为null将会new 一个Matrix4_4
        * @returns Matrix4_4 返回计算的结果
        * @version Egret 3.0
        * @platform Web,Native
        */
        public static reflection(plane: Plane3D, target: Matrix4_4 = null): Matrix4_4 {
            if (target === null)
                target = new Matrix4_4();

            var a: number = plane.a, b: number = plane.b, c: number = plane.c, d: number = plane.d;
            var rawData: Float32Array = MathUtil.RAW_DATA_CONTAINER;
            var ab2: number = -2 * a * b;
            var ac2: number = -2 * a * c;
            var bc2: number = -2 * b * c;
            // reflection matrix
            rawData[0] = 1 - 2 * a * a;
            rawData[4] = ab2;
            rawData[8] = ac2;
            rawData[12] = -2 * a * d;
            rawData[1] = ab2;
            rawData[5] = 1 - 2 * b * b;
            rawData[9] = bc2;
            rawData[13] = -2 * b * d;
            rawData[2] = ac2;
            rawData[6] = bc2;
            rawData[10] = 1 - 2 * c * c;
            rawData[14] = -2 * c * d;
            rawData[3] = 0;
            rawData[7] = 0;
            rawData[11] = 0;
            rawData[15] = 1;
            target.copyRawDataFrom(rawData);

            return target;
        }

        /**
        * @private
        * @language zh_CN
        * 得到矩阵的平移
        * @param transform 计算的矩阵
        * @param result 计算返回平移坐标 可为null 如果为null将会new 一个Vector3D
        * @returns Vector3D 返回平移坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        public static getTranslation(transform: Matrix4_4, result: Vector3D = null): Vector3D {
            if (!result)
                result = new Vector3D();

            transform.copyRowTo(3, result);
            return result;
        }

        /**
        * @private
        * @language zh_CN
        * 把一个值固定在一个范围之内
        * @param value 当前判定的值
        * @param min_inclusive 最小取值
        * @param max_inclusive 最大取值
        * @returns number 计算后的结果
        * @version Egret 3.0
        * @platform Web,Native
        */
        public static clampf(value: number, min_inclusive: number, max_inclusive: number) : number {
            if (min_inclusive > max_inclusive) {
                var temp: number = min_inclusive;
                min_inclusive = max_inclusive;
                max_inclusive = temp;
            }
            return value < min_inclusive ? min_inclusive : (value < max_inclusive ? value : max_inclusive);
        }

        /**
        * @private
        */
        public static ScreenToPosition(value: number, offset: number, max: number): number {
            return (value + offset * 0.5) / max * 2 - 1;
        }

        /**
        * @private
        */
        public static PositionToScreen(value: number, offset: number, max: number): number {
            return (value + 1) * 0.5 * max - offset * 0.5;
        }

        /**
        * @private
        */
        public static mix(value0: number, value1: number, t: number): number {
            return value0 * (1 - t) + value1 * t;
        }


        private static _tempVector: Vector3D = new Vector3D();
        /**
        * @private
        */
        public static calcDegree(quat: Quaternion, angleVector: Vector3D): void {

            //计算billboard矩阵x
            quat.transformVector(Vector3D.Y_AXIS, this._tempVector);
            this._tempVector.x = 0;
            this._tempVector.normalize();
            var dotX: number = Vector3D.Y_AXIS.dotProduct(this._tempVector);
            var angleX: number = Math.acos(dotX) * MathUtil.RADIANS_TO_DEGREES;
            if (this._tempVector.z < 0) {
                angleX = 180 - angleX;
            }

            //计算billboard矩阵y
            quat.transformVector(Vector3D.Z_AXIS, this._tempVector);
            this._tempVector.y = 0;
            this._tempVector.normalize();
            var dotY: number = Vector3D.Z_AXIS.dotProduct(this._tempVector);
            var angleY: number = Math.acos(dotY) * MathUtil.RADIANS_TO_DEGREES;
            if (this._tempVector.x < 0) {
                angleY = 360 - angleY;
            }


            //计算billboard矩阵z
            quat.transformVector(Vector3D.X_AXIS, this._tempVector);
            this._tempVector.z = 0;
            this._tempVector.normalize();
            var dotZ: number = Vector3D.X_AXIS.dotProduct(this._tempVector);
            var angleZ: number = Math.acos(dotZ) * MathUtil.RADIANS_TO_DEGREES;
            if (this._tempVector.y < 0) {
                angleZ = 360 - angleZ;
            }


            angleX = this.clampAngle(angleX);
            angleY = this.clampAngle(angleY);
            angleZ = this.clampAngle(angleZ);

            angleVector.setTo(angleX, angleY, angleZ);
        }

        private static clampAngle(angle: number): number {
            while (angle < -180) {
                angle += 360;
            }
            while (angle > 180) {
                angle -= 360;
            }
            return angle;
        }

    }
} 