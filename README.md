**Deploy aplicação - Bem-vindo ao wiki da aplicação de exemplo do clima tempo**


1 - Pré-requisito 
* Uma conta AWS.
* Docker
* Um cluster de serviço ECS ou EKS

2 - Clone do repositório via git.

* Para clonar o repositório, crie uma pasta no seu SO e execute o comando no terminal a partir da pasta que você criou.
Copie a URL do endereço do repositório na aba code e Utilize o exemplo abaixo:
Digite: <pre><code>git clone https://github.com/gudesantana/<nome_do_repositorio>.git</code></pre>

3 - Dependências do Node.js
* Para instalação das dependências do node.js execute o comando abaixo:
<pre><code>npm install axios mysql2 express cors</code></pre>

4 - Criação do container
* Para criação do container da aplicação backend, execute o comando abaixo para criação do container
<pre><code>docker build -t llabs-appbackend-v1 .</code></pre>
* O nome do container é sugerido. Esteja livre para utilizar seu padrão.

5 - Execução do container 
* Execute o container na porta 3000 para testes e validação da aplicação. 
<pre><code>docker run -d -p 3000:3000 --name llabs-appbackend-v1 llabs-appbackend-v1</code></pre>

6 - Acesso ao Banco de dados
* O Banco de dados foi criado no RDS em base MySql.
* A aplicação backend esta configurada para acessar o banco localmente. A aplicação frontend não tem acesso ao banco, tendo acesso somente a aplicação backend pelas seguintes subnets internas:
<pre><code>
10.60.1.0/24
10.60.3.0/24
</code></pre>

a URL do banco de chamada do banco é 
<pre><code>llabsdb.good.tec.br</code></pre>
ou internamente como:
<pre><code>llabsdb.good.tec.br</code></pre>
llabsdbmsqlv1.cj0iow28m1f5.us-east-1.rds.amazonaws.com

Dados do banco de dados:
<pre><code>
host: '10.60.3.211'
user: 'admin'
database: 'llabsrdspgdbapps'
password: 'xxxx'
port: 3306
</code></pre>
Para Password, Favor entrar em contato.
6 - Endereço da API
* A api é gratuita e tem limite de 300 acessos diários. Deve ter esse acesso bem reservado para os testes senão eles falharão:

* segue a url da api:
<pre><code>http://apiadvisor.climatempo.com.br/api/v1/anl/synoptic/locale/BR?<token=seutoken></code></pre>

* Caso não tenha o token adquira uma pelo endereço da api no site clima tempo
<pre><code>http://apiadvisor.climatempo.com.br</code></pre>

* Efetue login com um e-mail valido no site.
  Crie um novo projeto.
  Será entregue um novo token de acesso para uso na api. Complete a URL acima com o novo token.
Edite a aplicação no arquivo app.js e recrie o container logo após repetindo os passos de 3 a 5.

Obs: Essa aplicação acessa uma api do site clima tempo que é gratuita e tem um limite de requisições diárias.
Caso as requisições passe de 300 acessos diários, teremos que esperar pelo próximo dia e apresentará esse erro:
Acesso a aplicação de frontend
<img width="261" alt="image" src="https://github.com/user-attachments/assets/3e5c0c9f-97fb-41cc-8e42-b43c73395cde">

Acesso a aplicação de backend
<img width="133" alt="image" src="https://github.com/user-attachments/assets/e63d59f7-a0b4-4fa5-a1b0-0cbf94ac9de3">

Caso aconteça, favor entrar em contato para redirecionarmos um novo container com nova key de acesso.

7 - Push do container para o ECR na AWS
* Efetue Primeiramente o login no container apartir da máquina que irá efetuar o push.
Execute o comando 

<pre><code>
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 816069124394.dkr.ecr.us-east-1.amazonaws.com
</code></pre>

* Crie o tag do container permitindo seu push ao repositório.
<pre><code>
docker tag llabs-appback-v1 816069124394.dkr.ecr.us-east-1.amazonaws.com/ecr-llabs-appback-prd:llabs-appback-v1
</code></pre>

* Efetue o push do container no repositório ECR da AWS
<pre><code>
docker push 816069124394.dkr.ecr.us-east-1.amazonaws.com/ecr-llabs-appback-prd:llabs-appback-v1
</code></pre>

8 - Acesso à aplicação.
a aplicação backend e frontend podem ser acessada após a disponibilização do cluster de ECS é:

* Frontend
<pre><code>
clima.good.tec.br:3001 
ou
appfront.good.tec.br
ou
loadbalance do cluster ECS.
</code></pre>

* Backend
<pre><code>
clima.good.tec.br:3000 
ou
appback.good.tec.br
ou
loadbalance do cluster ECS.
</code></pre>

* Para criação de novos clusters, alterar as seguintes variáveis nos arquivos tfvars. Alterar a seguinte linha copiando os valores do URI do container no repositório respectivo no ECR.

<pre><code>
app_image = 816069124394.dkr.ecr.us-east-1.amazonaws.com/ecr-llabs-appback-prd:llabs-backapp-v1
</code></pre>

* Após o push do container executar os seguintes comandos no terraform

<pre><code>
Terraform workspace list
</code></pre>

<pre><code>
Terraform workspace select <workspace do projeto>
</code></pre>

<pre><code>
terraform plan -var-file="llabs-prd-appback.tfvars" <workspace do projeto>
</code></pre>
Valide se as alterações correspondem somente as alterações do URI do container no ECR.

<pre><code>
terraform apply -var-file="llabs-prd-appback.tfvars" <workspace do projeto>
</code></pre>
Digite yes para aceitar as mudanças.

* Seu cluster ECS com sua aplicação já deverá estar disponível para uso.
Podendo ser validada pelo endereço clima.good.tec.br:3000

* A aplicação esta configurada para receber acesso apenas do frontend.
Caso queira acessar para testes crie um security group com seu ip local ou seguimento para testes:
caso queira alterar no terraform, altere o seguinte arquivo em modules/ecs-fargate/security.tf com as seguintes linhas e cole o comando a partir da linha 27. segue:
<pre><code>
ingress {
    protocol    = "tcp"
    from_port   = 3000
    to_port     = 3000
    cidr_blocks = ["<Seu_IP"]
}
</code></pre>

9 - Fim

Se você chegou até aqui, todos os passos foram configurados e recursos implementados corretamente.
Vamos para o próximo repositório para criação da conta HML e posteriormente a parametrização das contas de PRD e HML.

Abraço. Be Good! :)
