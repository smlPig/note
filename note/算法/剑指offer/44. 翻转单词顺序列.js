/**
 * @Author nzq
 * @Date 2019/5/30
 * @Description: 牛客最近来了一个新员工Fish，每天早晨总是会拿着一本英文杂志，写些句子在本子上。同事Cat对Fish写的内容颇感兴趣，有一天他向Fish借来翻看，但却读不懂它的意思。例如，“student. a am I”。后来才意识到，这家伙原来把句子单词的顺序翻转了，正确的句子应该是“I am a student.”。Cat对一一的翻转这些单词顺序可不在行，你能帮助他么？
 * @Param:
 * @Return:
 */

function _ReverseSentence(str)
{
  // write code here
  if (!str) return '';
  return str.split(' ').reverse().join(' ');
}

// 思路二：正则表达式
function ReverseSentence(str)
{
  // write code here
  return str.match(/[a-zA-Z]+\.?/g).reverse().join(' ');
}

console.log(ReverseSentence('student. a am I'));
