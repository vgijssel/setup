#ifndef TYPES_H
#define TYPES_H

/**
 * A class that contains a <value, timestamp> tuple.
 *
 * @tparam VAL_T the value type
 * @tparam TS_T the timestamp type, defaults to `unsigned long`
 * as per Arduino references for `millis` and `micros`.
 */
template <typename VAL_T, typename TS_T=unsigned long>
class Reading
{
public:
	VAL_T value;
	TS_T timestamp;
	Reading() : value(0), timestamp(0) {}
	Reading(VAL_T v, TS_T ts) : value(v), timestamp(ts) { }
};

/**
 * A class to represent the speed and acceleration of a value
 * in addition to itself.
 *
 * @tparam T the type of the position, speed, and acceleration values
 */
template <typename T>
class Differential
{
public:
	T position;
	T speed;
	T acceleration;
	Differential(T pos, T spd, T acc) : position(pos), speed(spd), acceleration(acc) { }
	Differential(T val) : Differential(val, val, val) { }
};

#endif
