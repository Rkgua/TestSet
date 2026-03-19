import React, { useState, useEffect } from 'react';
import './App.css'; // 引入样式文件

function App() {
  // --- 状态管理 ---
  const [searchTerm, setSearchTerm] = useState(''); // 搜索关键词
  const [movies, setMovies] = useState([]);         // 搜索结果
  const [loading, setLoading] = useState(false);    // 加载状态
  const [error, setError] = useState('');           // 错误信息
  const [selectedMovie, setSelectedMovie] = useState(null); // 选中的电影
  // 推荐电影数据
  const recommendedMovies = [
    {
      id: 'r1',
      title: '《星际穿越》',
      year: '2014',
      poster: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.fL0nojDf77J85ED5HhRmkQHaEo?w=244&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2.com/view/photo/s_ratio_poster/public/p513344864.jpg',
      plot: '一部关于宇宙和亲情的科幻巨作',
      rating: '9.3/10'
    },
    {
      id: 'r2',
      title: '《盗梦空间》',
      year: '2010',
      poster: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.fL0nojDf77J85ED5HhRmkQHaEo?w=244&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2.com/view/photo/s_ratio_poster/public/p513344864.jpg',
      plot: '梦境与现实交错的烧脑大片',
      rating: '9.2/10'
    },
    {
      id: 'r3',
      title: '《阿凡达》',
      year: '2009',
      poster: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.fL0nojDf77J85ED5HhRmkQHaEo?w=244&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2.com/view/photo/s_ratio_poster/public/p513344864.jpg',
      plot: '视觉革命的科幻史诗',
      rating: '8.8/10'
    },
    {
      id: 'r4',
      title: '《肖申克的救赎》',
      year: '1994',
      poster: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.fL0nojDf77J85ED5HhRmkQHaEo?w=244&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2.com/view/photo/s_ratio_poster/public/p513344864.jpg',
      plot: '希望让人自由',
      rating: '9.7/10'
    }
  ];

  // 渲染推荐电影，每行2个
  const renderRecommended = () => {
    const rows = [];
    for (let i = 0; i < recommendedMovies.length; i += 2) {
      rows.push(
        <div className="recommend-row" key={i} style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          {recommendedMovies.slice(i, i + 2).map((movie) => (
            <div
              key={movie.id}
              className="movie-item"
              onClick={() => setSelectedMovie(movie)}
              style={{ cursor: 'pointer', border: '1px solid #ccc', margin: '10px', padding: '10px', width: 200 }}
            >
              <img src={movie.poster} alt={movie.title} style={{ width: '50px', float: 'left', marginRight: '10px' }} />
              <h3>{movie.title}</h3>
              <p style={{ display: 'flex', justifyContent: 'center' }}>年份: {movie.year}</p>
            </div>
          ))}
        </div>
      );
    }
    return rows;
  };

  // --- 测试数据 ---
  // 会按照输入的关键词返回相关模拟数据，输入 "error" 则模拟错误情况
  const mockSearchMovies = (term) => {
   
    return new Promise((resolve) => {
      setTimeout(() => {
        if (term.toLowerCase() === 'error') {
          // 模拟错误
          resolve({ error: '网络错误或未找到电影' });
        } else {
          // 模拟返回数据
          const mockData = [
            {
              id: 1,
              title: `《${term}：复仇者联盟》`,
              year: '2023',
              poster: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.fL0nojDf77J85ED5HhRmkQHaEo?w=244&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2.com/view/photo/s_ratio_poster/public/p513344864.jpg', // 占位图
              plot: '这是一部关于复仇者联盟的精彩电影...',
              rating: '8.5/10'
            },
            {
              id: 2,
              title: `《${term}大电影》`,
              year: '2020',
              poster: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.fL0nojDf77J85ED5HhRmkQHaEo?w=244&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2.com/view/photo/s_ratio_poster/public/p513344864.jpg',
              plot: '一部普通的动画大电影...',
              rating: '7.0/10'
            }
          ];
          resolve({ Search: mockData });
        }
      }, 1000);
    });
  };

  // --- 搜索处理函数 ---
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('请输入电影名称');
      return;
    }

    setLoading(true);
    setError('');
    setMovies([]);

    try {
      const response = await mockSearchMovies(searchTerm);
      
      if (response.error) {
        setError(response.error);
      } else {
        setMovies(response.Search);
      }
    } catch (err) {
      setError('搜索失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // --- 渲染列表项 ---
  const renderMovieItems = () => {
    if (loading) return <p>🔍 正在加载...</p >;
    if (error) return <p style={{ color: 'red' }}>❌ {error}</p >;
    if (movies.length === 0 && searchTerm) return <p>🤷‍♂️ 没有找到相关电影</p >;

    return movies.map((movie) => (
      <div 
        key={movie.id} 
        className="movie-item" 
        onClick={() => setSelectedMovie(movie)} // 点击显示详情
        style={{ cursor: 'pointer', border: '1px solid #ccc', margin: '10px', padding: '10px' }}
      >
        < img src={movie.poster} alt={movie.title} style={{ width: '50px', float: 'left', marginRight: '10px' }} />
        <h3 style={{display: 'flex', justifyContent: 'center' }}>{movie.title}</h3>
        <p style={{display: 'flex', justifyContent: 'center' }}>年份: {movie.year}</p >
      </div>
    ));
  };

  return (
    <div className="app-container">
      <h1>🎬 电影搜索 Demo</h1>

    
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="请输入电影名称"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        />
        <button onClick={handleSearch} style={{ padding: '8px 15px', marginLeft: '10px' }}>
          搜索
        </button>
      </div>

      {/* 结果展示区域 */}
      <div className="results">
        {renderMovieItems()}
      </div>

      {/* 推荐板块（移动到搜索结果后） */}
      <div style={{ margin: '30px 0' }}>
        <h2 style={{ marginBottom: 20 }}>🔥 推荐电影</h2>
        {renderRecommended()}
      </div>

      {/* 详情模态框 */}
      {selectedMovie && (
        <div className="modal" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setSelectedMovie(null)}>&times;</span>
            <h2>{selectedMovie.title}</h2>
            <p><strong>评分：</strong>{selectedMovie.rating}</p>
            <p><strong>简介：</strong>{selectedMovie.plot}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;