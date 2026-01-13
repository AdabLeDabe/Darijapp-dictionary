# Darijapp dictionary

This repository contains tools to help me fill the dictionary that will be used in my maghrebi arabic learning app.

## Api

A go api that talks to a postgresql database to fill and query it. The api collections folder contains a bruno collection with all the available requests.

## Darijapp dictionary frontend

A react typescript app that is the entry point of this whole toolset. It presents a list of every word in the database and allows to create and edit words as well as categories. Obviously uses the api.

## Phonetic arabic keyboard

A small wpf app that is basically like the virtual keyboard on windows but with a specific keyboard made for writing arabic in phonetic. It matches closely but not exactly this way of writing phonetic arabic: https://www.lexilogos.com/clavier/arabe_latin.htm

It is not the only way of writing phonetic arabic but it is the one I learned with. It is convenient because one latin letter = one arabic letter.