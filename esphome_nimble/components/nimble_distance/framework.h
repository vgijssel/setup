/**
 * @file framework.h
 * %Filter framework.
 *
 * @author Haimo Zhang <zh.hammer.dev@gmail.com>
 */
#ifndef FRAMEWORK_H
#define FRAMEWORK_H

#include "FilterList.h"
#include "Tree.h"

/**
 * The %Filter interface without type checking at compile time.
 *
 * @note
 * It is the client code's responsibility to ensure
 * that the correct pointers are passed to the filter.
 */
class Filter
{
	// Composite filter classes need to access protected and private members
	// of Filter instances, and are thus marked as friends.
	friend class FilterChain;
	friend class FilterTree;
public:
	/**
	 * Push a new data through the filter.
	 *
	 * A filter is not required to always output a data in response
	 * to a new input data.
	 * For example, a delay filter might wait for several input data
	 * before outputing.
	 * This behavior is supported through the boolean return value.
	 *
	 * @note
	 * The input and output memory is managed by the client code,
	 * i.e., the client code is responsible for
	 * the lifetime of the input and output memory
	 * and the validity of the two pointers.
	 *
	 * @param[in] input
	 * A read-only pointer to the input data.
	 * When the input pointer is NULL, this function returns false.
	 *
	 * @param[out] output
	 * A pointer to the memory (managed by the client code)
	 * where the output data is to be written.
	 *
	 * @returns
	 * True if there is output data; false otherwise.
	 * @note
	 * The output memory is not guaranteed to remain the same even if
	 * the return value is false.
	 *
	 * @note
	 * Derived classes should not overload this member function.
	 * For composite filters that combine several filters
	 * (e.g., FilterChain and FilterTree),
	 * it is recommended to derive from this class
	 * and override its protected member functions.
	 * For filters that perform actual computation,
	 * it is recommended to derive from the BaseFilter class
	 * and only override its BaseFilter::update member function,
	 * since the BaseFilter class already takes care of
	 * the other protected member functions for the internal workings.
	 */
	bool push(void const * const input, void * const output)
	{
		if (input != NULL && update(input)) {
			copy_to_client(output);
			return true;
		}
		return false;
	}
protected:
	/**
	 * Read-only access to the internal output memory.
	 *
	 * This member function is mainly used by derived composite filters,
	 * which needs to point the output of the previous filter stage
	 * to the input of the next fitler stage.
	 * See for example the implementation of FilterChain.
	 *
	 * @returns
	 * A read-only pointer to the memory where the output value is stored internally
	 * by the filter.
	 */
	virtual void const * const get_output_val_ptr() = 0;
	/**
	 * Internally update the filter output based on the given input.
	 * This method behaves similarly to the public Filter::push method,
	 * but without copying the output to the client memory.
	 * This method is for internal workings of the filter framework.
	 */
	virtual bool update(void const * const input) = 0;
	/**
	 * Copy the output to client memory.
	 */
	virtual void copy_to_client(void * const output) = 0;
};

/**
 * The typed filter base class.
 *
 * @tparam IN_T type of input data
 * @tparam OUT_T type of output data
 *
 * @see Filter
 */
template <typename IN_T, typename OUT_T>
class BaseFilter : public Filter
{
public:

//// OBSOLETE NOTE ////////////////////////////////////////////////////////////
//// The typed `push` method was originally designed to be beginner-friendly
//// by passing by references to avoid the need to familiarize with pointers.
//// Due to requirement of some filter classes (composite filters such as
//// FilterChain, FilterTree, and PassThroughFilter), the input and output
//// need to be passed by pointers.  To provide a unified use case, I have
//// decided to remove the typed `push` method.
////
//// Haimo Zhang, 9 Jun 2019
////
//
//	/*
//	 * Push a new data through the filter.
//	 * This function is essentially a proxy call to the Filter::push function
//	 * that does away the pointer parameter, which is supposed to be
//	 * beginner-friendly.
//	 *
//	 * @param[in] input A read-only reference to the input data.
//	 * @param[out] output The reference to the output data to be written to.
//	 *
//	 * @returns True if there is output data; false otherwise.
//	 * @note The output variable is not guaranteed to remain the same even if
//	 * the return value is false.
//	 */
//	bool push(IN_T const &input, OUT_T &output)
//	{
//		return Filter::push(&input, &output);
//	}
///////////////////////////////////////////////////////////////////////////////

protected:
	virtual void const * const get_output_val_ptr() final { return &out_val; }
	virtual void copy_to_client(void * const output) final
	{
		if (output != NULL) {
			*(OUT_T * const) output = out_val;
		}
	}
	/**
	 * Internally managed storage of the output value.
	 */
	OUT_T out_val;
};

/**
 * A pass-through filter does nothing and is useful for derived classes
 * to perform monitoring functionalities, such as the FlowRateFilter.
 *
 * @tparam T The type of the data that is passing through.
 */
template <typename T>
class PassThroughFilter : public Filter
{
public:
	PassThroughFilter() : ptr(NULL) { }
protected:
	virtual void const * const get_output_val_ptr() override { return ptr; }
	virtual bool update(void const * const input) override
	{
		ptr = (T const * const) input;
		return true;
	}
	virtual void copy_to_client(void * const output) override
	{
		if (output != NULL) {
			*(T * const) output = *ptr;
		}
	}
	T const *ptr;  ///< Pointer to the latest data that passed through.
};

/**
 * A chain of filters.
 */
class FilterChain : public FilterList<Filter *>, public Filter
{
protected:
	virtual void const * const get_output_val_ptr() final
	{
		return (*last())->get_output_val_ptr();
	}
	virtual bool update(void const * const input) final
	{
		for (it = begin(); it != last(); ++it) {
			if (!(*it)->update(it != begin() ? (*prev)->get_output_val_ptr() : input)) {
				return false;
			}
			prev = it;
		}
		return (*it)->update((*prev)->get_output_val_ptr());
	}
	virtual void copy_to_client(void * const output) final
	{
		if (output != NULL && !isEmpty()) {
			(*last())->copy_to_client(output);
		}
	}
private:
	FilterList<Filter *>::iterator it;
	FilterList<Filter *>::iterator prev;
};

/**
 * A tree of interconnected filters.
 * While a filter has only one input, it can output to multiple other filters.
 * Therefore, we can construct a tree of filters to simplify the interaction
 * with complex filter graph in the client code.
 *
 * @todo Implement the filter tree when this use case is needed.
 */
class FilterTree : public Tree<Filter *>
{
};

#endif
