import streamlit as st

if "turn" not in st.session_state:
    st.session_state.turn = 0

st.title("🎲 Mens Erger Je Niet")
st.title("🔵 Blauw Tegen 🟡 Geel")

st.caption(
    "Zet de pionnetjes op de juiste beginstand en volg de volgende instructies op."
)

st.caption(
    "N.B.: wanneer je kleur op het oversteekveld landt, mag je de volgende beurt direct naar de overkant. Zet alleen een 2e pion in wanneer het er staat."
)


def click_button():
    st.session_state.turn += 1


def reset():
    st.session_state.turn = 0


turns = [
    "",
    "Blauw begint en gooit direct 6",
    "Blauw mag nog een keer en gooit 4",
    "Geel gooit 4",
    "Blauw gooit 2",
    "Geel gooit 5",
    "Blauw gooit 1",
    "Geel gooit 6",
    "Geel mag nog een keer en gooit 6",
    "Geel mag nog een keer en gooit 4",
    "Blauw gooit 5",
    "Geel gooit 3",
    "Blauw gooit 3",
    "Geel gooit 5",
    "Blauw gooit 6, neemt een 2e pion",
    "Blauw mag nog een keer en gooit 2 en loopt met 2e pion",
    "Geel gooit 6",
    "Geel mag nog een keer en gooit 4",
    "Blauw gooit 6",
    "Blauw mag nog een keer en gooit 4",
    "Geel gooit 6",
    "Geel mag nog een keer en gooit 2",
    "Blauw gooit 3",
    "Geel gooit 6",
    "Geel mag nog een keer en gooit 6",
    "Geel mag nog een keer en gooit 2",
    "Einstand: Tel nu vanaf de beginpositie (eerste vakje is 1). N.B.: Neem de gehele buitenste paden.",
]

turn = turns[st.session_state.turn]
st.write(turn)

if st.session_state.turn == 0:
    st.button("Begin", on_click=click_button)
elif st.session_state.turn == len(turns) - 1:
    st.balloons()
    st.button("Opnieuw", on_click=reset)
else:
    st.button("Volgende", on_click=click_button)
