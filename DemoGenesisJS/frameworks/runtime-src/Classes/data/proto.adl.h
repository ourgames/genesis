#ifndef proto_adl_h_adata_header_define
#define proto_adl_h_adata_header_define

#include <adata.hpp>

namespace hlgenesis {
  struct msg_header
  {
    uint32_t len;
    uint32_t type;
    uint32_t id;
    msg_header()
    :    len(0),
    type(0),
    id(0)
    {}
  };

  struct c2s_test_data
  {
    uint32_t color;
    ::std::string name;
    ::std::string temp;
    ::std::string weight;
    ::std::string halo;
    ::std::string trail;
    c2s_test_data()
    :    color(0)
    {}
  };

  struct s2c_test_data
  {
    uint32_t code;
    ::std::string message;
    s2c_test_data()
    :    code(0)
    {}
  };

}

namespace adata
{
template<>
struct is_adata<hlgenesis::msg_header>
{
  static const bool value = true;
};

template<>
struct is_adata<hlgenesis::c2s_test_data>
{
  static const bool value = true;
};

template<>
struct is_adata<hlgenesis::s2c_test_data>
{
  static const bool value = true;
};

}
namespace adata
{
  template<typename stream_ty>
  inline void read( stream_ty& stream, ::hlgenesis::msg_header& value)
  {
    ::std::size_t offset = stream.read_length();
    uint64_t tag = 0;
    read(stream,tag);
    if(stream.error()){return;}
    int32_t len_tag = 0;
    read(stream,len_tag);
    if(stream.error()){return;}

    if(tag&1ULL)    {read(stream,value.len);{if(stream.error()){stream.trace_error("len",-1);return;}}}
    if(tag&2ULL)    {read(stream,value.type);{if(stream.error()){stream.trace_error("type",-1);return;}}}
    if(tag&4ULL)    {read(stream,value.id);{if(stream.error()){stream.trace_error("id",-1);return;}}}
    if(len_tag >= 0)
    {
      ::std::size_t read_len = stream.read_length() - offset;
      ::std::size_t len = (::std::size_t)len_tag;
      if(len > read_len) stream.skip_read(len - read_len);
    }
  }

  template <typename stream_ty>
  inline void skip_read(stream_ty& stream, ::hlgenesis::msg_header*)
  {
    skip_read_compatible(stream);
  }

  inline int32_t size_of(const ::hlgenesis::msg_header& value)
  {
    int32_t size = 0;
    uint64_t tag = 7ULL;
    {
      size += size_of(value.len);
    }
    {
      size += size_of(value.type);
    }
    {
      size += size_of(value.id);
    }
    size += size_of(tag);
    size += size_of(size + size_of(size));
    return size;
  }

  template<typename stream_ty>
  inline void write(stream_ty& stream , const ::hlgenesis::msg_header&value)
  {
    uint64_t tag = 7ULL;
    write(stream,tag);
    if(stream.error()){return;}
    write(stream,size_of(value));
    if(stream.error()){return;}
    {write(stream,value.len);{if(stream.error()){stream.trace_error("len",-1);return;}}}
    {write(stream,value.type);{if(stream.error()){stream.trace_error("type",-1);return;}}}
    {write(stream,value.id);{if(stream.error()){stream.trace_error("id",-1);return;}}}
    return;
  }

  template<typename stream_ty>
  inline void read( stream_ty& stream, ::hlgenesis::c2s_test_data& value)
  {
    ::std::size_t offset = stream.read_length();
    uint64_t tag = 0;
    read(stream,tag);
    if(stream.error()){return;}
    int32_t len_tag = 0;
    read(stream,len_tag);
    if(stream.error()){return;}

    if(tag&1ULL)    {read(stream,value.color);{if(stream.error()){stream.trace_error("color",-1);return;}}}
    if(tag&2ULL)
    {
      uint32_t len = check_read_size(stream);
      {if(stream.error()){stream.trace_error("name",-1);return;}}
      value.name.resize(len);
      stream.read((char *)value.name.data(),len);
      {if(stream.error()){stream.trace_error("name",-1);return;}}
    }
    if(tag&4ULL)
    {
      uint32_t len = check_read_size(stream);
      {if(stream.error()){stream.trace_error("temp",-1);return;}}
      value.temp.resize(len);
      stream.read((char *)value.temp.data(),len);
      {if(stream.error()){stream.trace_error("temp",-1);return;}}
    }
    if(tag&8ULL)
    {
      uint32_t len = check_read_size(stream);
      {if(stream.error()){stream.trace_error("weight",-1);return;}}
      value.weight.resize(len);
      stream.read((char *)value.weight.data(),len);
      {if(stream.error()){stream.trace_error("weight",-1);return;}}
    }
    if(tag&16ULL)
    {
      uint32_t len = check_read_size(stream);
      {if(stream.error()){stream.trace_error("halo",-1);return;}}
      value.halo.resize(len);
      stream.read((char *)value.halo.data(),len);
      {if(stream.error()){stream.trace_error("halo",-1);return;}}
    }
    if(tag&32ULL)
    {
      uint32_t len = check_read_size(stream);
      {if(stream.error()){stream.trace_error("trail",-1);return;}}
      value.trail.resize(len);
      stream.read((char *)value.trail.data(),len);
      {if(stream.error()){stream.trace_error("trail",-1);return;}}
    }
    if(len_tag >= 0)
    {
      ::std::size_t read_len = stream.read_length() - offset;
      ::std::size_t len = (::std::size_t)len_tag;
      if(len > read_len) stream.skip_read(len - read_len);
    }
  }

  template <typename stream_ty>
  inline void skip_read(stream_ty& stream, ::hlgenesis::c2s_test_data*)
  {
    skip_read_compatible(stream);
  }

  inline int32_t size_of(const ::hlgenesis::c2s_test_data& value)
  {
    int32_t size = 0;
    uint64_t tag = 1ULL;
    if(!value.name.empty()){tag|=2ULL;}
    if(!value.temp.empty()){tag|=4ULL;}
    if(!value.weight.empty()){tag|=8ULL;}
    if(!value.halo.empty()){tag|=16ULL;}
    if(!value.trail.empty()){tag|=32ULL;}
    {
      size += size_of(value.color);
    }
    if(tag&2ULL)
    {
      {
        uint32_t len = (uint32_t)(value.name).size();
        size += size_of(len);
        size += len;
        }
    }
    if(tag&4ULL)
    {
      {
        uint32_t len = (uint32_t)(value.temp).size();
        size += size_of(len);
        size += len;
        }
    }
    if(tag&8ULL)
    {
      {
        uint32_t len = (uint32_t)(value.weight).size();
        size += size_of(len);
        size += len;
        }
    }
    if(tag&16ULL)
    {
      {
        uint32_t len = (uint32_t)(value.halo).size();
        size += size_of(len);
        size += len;
        }
    }
    if(tag&32ULL)
    {
      {
        uint32_t len = (uint32_t)(value.trail).size();
        size += size_of(len);
        size += len;
        }
    }
    size += size_of(tag);
    size += size_of(size + size_of(size));
    return size;
  }

  template<typename stream_ty>
  inline void write(stream_ty& stream , const ::hlgenesis::c2s_test_data&value)
  {
    uint64_t tag = 1ULL;
    if(!value.name.empty()){tag|=2ULL;}
    if(!value.temp.empty()){tag|=4ULL;}
    if(!value.weight.empty()){tag|=8ULL;}
    if(!value.halo.empty()){tag|=16ULL;}
    if(!value.trail.empty()){tag|=32ULL;}
    write(stream,tag);
    if(stream.error()){return;}
    write(stream,size_of(value));
    if(stream.error()){return;}
    {write(stream,value.color);{if(stream.error()){stream.trace_error("color",-1);return;}}}
    if(tag&2ULL)
    {
      uint32_t len = (uint32_t)(value.name).size();
      write(stream,len);
      stream.write((value.name).data(),len);
      {if(stream.error()){stream.trace_error("name",-1);return;}}
    }
    if(tag&4ULL)
    {
      uint32_t len = (uint32_t)(value.temp).size();
      write(stream,len);
      stream.write((value.temp).data(),len);
      {if(stream.error()){stream.trace_error("temp",-1);return;}}
    }
    if(tag&8ULL)
    {
      uint32_t len = (uint32_t)(value.weight).size();
      write(stream,len);
      stream.write((value.weight).data(),len);
      {if(stream.error()){stream.trace_error("weight",-1);return;}}
    }
    if(tag&16ULL)
    {
      uint32_t len = (uint32_t)(value.halo).size();
      write(stream,len);
      stream.write((value.halo).data(),len);
      {if(stream.error()){stream.trace_error("halo",-1);return;}}
    }
    if(tag&32ULL)
    {
      uint32_t len = (uint32_t)(value.trail).size();
      write(stream,len);
      stream.write((value.trail).data(),len);
      {if(stream.error()){stream.trace_error("trail",-1);return;}}
    }
    return;
  }

  template<typename stream_ty>
  inline void read( stream_ty& stream, ::hlgenesis::s2c_test_data& value)
  {
    ::std::size_t offset = stream.read_length();
    uint64_t tag = 0;
    read(stream,tag);
    if(stream.error()){return;}
    int32_t len_tag = 0;
    read(stream,len_tag);
    if(stream.error()){return;}

    if(tag&1ULL)    {read(stream,value.code);{if(stream.error()){stream.trace_error("code",-1);return;}}}
    if(tag&2ULL)
    {
      uint32_t len = check_read_size(stream);
      {if(stream.error()){stream.trace_error("message",-1);return;}}
      value.message.resize(len);
      stream.read((char *)value.message.data(),len);
      {if(stream.error()){stream.trace_error("message",-1);return;}}
    }
    if(len_tag >= 0)
    {
      ::std::size_t read_len = stream.read_length() - offset;
      ::std::size_t len = (::std::size_t)len_tag;
      if(len > read_len) stream.skip_read(len - read_len);
    }
  }

  template <typename stream_ty>
  inline void skip_read(stream_ty& stream, ::hlgenesis::s2c_test_data*)
  {
    skip_read_compatible(stream);
  }

  inline int32_t size_of(const ::hlgenesis::s2c_test_data& value)
  {
    int32_t size = 0;
    uint64_t tag = 1ULL;
    if(!value.message.empty()){tag|=2ULL;}
    {
      size += size_of(value.code);
    }
    if(tag&2ULL)
    {
      {
        uint32_t len = (uint32_t)(value.message).size();
        size += size_of(len);
        size += len;
        }
    }
    size += size_of(tag);
    size += size_of(size + size_of(size));
    return size;
  }

  template<typename stream_ty>
  inline void write(stream_ty& stream , const ::hlgenesis::s2c_test_data&value)
  {
    uint64_t tag = 1ULL;
    if(!value.message.empty()){tag|=2ULL;}
    write(stream,tag);
    if(stream.error()){return;}
    write(stream,size_of(value));
    if(stream.error()){return;}
    {write(stream,value.code);{if(stream.error()){stream.trace_error("code",-1);return;}}}
    if(tag&2ULL)
    {
      uint32_t len = (uint32_t)(value.message).size();
      write(stream,len);
      stream.write((value.message).data(),len);
      {if(stream.error()){stream.trace_error("message",-1);return;}}
    }
    return;
  }

}

#endif
