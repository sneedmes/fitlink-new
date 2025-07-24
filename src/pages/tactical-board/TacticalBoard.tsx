import React from 'react';
import Header from "../../components/Header/Header";
import Title from "../../components/Title/Title";

const TacticalBoard = () => {

    return (
        <>
            <Header />
            <Title title={'Тактическая доска'}/>
            <div className='content'>
                <h2><a style={{color: "black", cursor: "pointer", textDecorationLine: "underline", textDecorationColor: "var(--color-active)"}} href="/Board/board.html" target="_blank" rel="noopener noreferrer">
                    Открыть тактическую доску →
                </a></h2>
                <p style={{marginTop: "100px"}}>Данная доска доступна с исходным кодом по ссылке: <i><a
                    style={{color: "black"}} href="https://github.com/zenggo/soccer-tactical?tab=readme-ov-file">github</a></i></p>
            </div>

        </>
    );
};

export default TacticalBoard;