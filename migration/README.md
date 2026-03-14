# migration

Rotina necessária para a migração dos arquivos xBase para MySQL



\## Algumas observações:

&nbsp;

-Os arquivos DBF desta pasta tiveram sua estrutura alterada para conter os ID necessários no SQL,



-Para migrar os arquivos da produção (DBF) será necessário executar o APPEND no lugar de substituir o arquivo todo, não 

&nbsp;deu tempo de parametrizar isso ainda.



-O programa migration.prg faz o preenchimento das novas colunas e cria um arquivo SQL para importação no banco.



-a compilação dele foi feita com o HB34 (c:\\hb34\\hb para preparar o ambiente)  e hbmk2 migration  para gerar o executável. 



-por enquanto todos os arquivos devem estar em uma pasta local.



&nbsp;



&nbsp;

